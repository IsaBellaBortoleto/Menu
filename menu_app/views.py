# menu_app/views.py

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from .models import Categoria, ItemMenu, Pedido
from .serializers import CategoriaSerializer, ItemMenuSerializer, PedidoSerializer

class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/categorias/ - Lista categorias com seus itens"""
    queryset = Categoria.objects.prefetch_related('itens').all()
    serializer_class = CategoriaSerializer
    
    @method_decorator(cache_page(60 * 5))  # Cache por 5 minutos
    def list(self, request, *args, **kwargs):
        """Cache GET /api/categorias/ por 5 min"""
        return super().list(request, *args, **kwargs)

class ItemMenuViewSet(viewsets.ModelViewSet):
    """CRUD completo de itens do cardápio"""
    serializer_class = ItemMenuSerializer

    def get_queryset(self):
        """Otimizado com select_related para Foreign Keys"""
        qs = ItemMenu.objects.select_related('categoria').all()
        categoria = self.request.query_params.get('categoria')
        if categoria:
            qs = qs.filter(categoria__slug=categoria)
        return qs
    
    @method_decorator(cache_page(60 * 5))  # Cache por 5 minutos (apenas GET)
    def list(self, request, *args, **kwargs):
        """Cache GET /api/itens/ por 5 min"""
        return super().list(request, *args, **kwargs)

class PedidoViewSet(viewsets.ModelViewSet):
    """CRUD completo de pedidos"""
    queryset = Pedido.objects.prefetch_related('itens__item_menu').order_by('-criado_em')
    serializer_class = PedidoSerializer

    @action(detail=True, methods=['patch'])
    def status(self, request, pk=None):
        """PATCH /api/pedidos/{id}/status/ - Atualiza status do pedido"""
        pedido = self.get_object()
        novo_status = request.data.get('status')
        if novo_status in dict(Pedido.STATUS_CHOICES):
            pedido.status = novo_status
            pedido.save()
            return Response(PedidoSerializer(pedido).data)
        return Response({'erro': 'Status inválido'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['patch'])
    def relatar_problema(self, request, pk=None):
        """PATCH /api/pedidos/{id}/relatar_problema/ - Cliente relata problema (UC005)"""
        pedido = self.get_object()
        problema_texto = request.data.get('problema', '').strip()
        
        # RN001: Campo obrigatório
        if not problema_texto:
            return Response(
                {'erro': 'Preencha o campo'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        pedido.problema = problema_texto
        pedido.save()
        return Response(PedidoSerializer(pedido).data)
