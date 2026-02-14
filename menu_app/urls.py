# menu_app/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoriaViewSet, ItemMenuViewSet, PedidoViewSet

router = DefaultRouter()
router.register(r'categorias', CategoriaViewSet, basename='categoria')
router.register(r'itens', ItemMenuViewSet, basename='itemmenu')
router.register(r'pedidos', PedidoViewSet, basename='pedido')

urlpatterns = [
    path('api/', include(router.urls)),
]
