"""
URL configuration for CardapioDigital project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from home import views as homeViews
from pedidos import views as pedViews

urlpatterns = [
    path('admin/', admin.site.urls),    
    path('', homeViews.home, name='home'),
    path('pedidos/', pedViews.pedidos),
    path('sucesso/', homeViews.pagina_de_sucesso, name='pagina_de_sucesso'),
    path('finalizar-pedido/', homeViews.finalizar_pedido_view, name='finalizar_pedido'),
    path('', include('pedidos.urls')),
    # Incluir a API REST do menu_app
    path('', include('menu_app.urls')),
]

# Adiciona o serviço de arquivos de mídia se estiver em modo de desenvolvimento
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    #path('carrinho/adicionar/<str:nome_produto>/', homeViwes. adicionar_item, name='adicionar_item'),

    # Mapeia a URL para remover um item.
    # A URL terá o formato: /carrinho/remover/posicao/
    #path('carrinho/remover/<int:posicao>/', homeViwes.remover_item_por_posicao, name='remover_item_por_posicao'),

    # URL para a página de produtos. Vamos criar uma view simples para isso.1# path('', views.listar_produtos, name='lista_produtos'),