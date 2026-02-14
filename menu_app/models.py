# menu_app/models.py

from django.db import models

class Categoria(models.Model):
    """Categorias do cardápio (Sanduíches, Pizzas, etc.)"""
    nome = models.CharField(max_length=100)
    emoji = models.CharField(max_length=10)
    slug = models.SlugField(unique=True)  # ex: "sanduiches"

    def __str__(self):
        return self.nome

class ItemMenu(models.Model):
    """Cada produto do cardápio"""
    nome = models.CharField(max_length=200, db_index=True)
    descricao = models.TextField()
    preco = models.DecimalField(max_digits=8, decimal_places=2)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='itens', db_index=True)
    imagem_url = models.CharField(max_length=500, blank=True)  # Changed from URLField to support relative paths

    def __str__(self):
        return f"{self.nome} - R$ {self.preco}"

class Pedido(models.Model):
    """Pedido feito pelo cliente"""
    STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('preparando', 'Preparando'),
        ('pronto', 'Pronto'),
        ('entregue', 'Entregue'),
    ]
    nome_cliente = models.CharField(max_length=200, db_index=True)
    mesa = models.IntegerField(db_index=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pendente', db_index=True)
    criado_em = models.DateTimeField(auto_now_add=True, db_index=True)
    problema = models.TextField(blank=True, default='')  # UC005: Campo para relatar problema

    class Meta:
        indexes = [
            models.Index(fields=['status', '-criado_em']),  # Index composto para filtros comuns
            models.Index(fields=['mesa', 'status']),
        ]

    def __str__(self):
        return f"Pedido #{self.id} - Mesa {self.mesa}"

class ItemPedido(models.Model):
    """Cada item dentro de um pedido"""
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='itens')
    item_menu = models.ForeignKey(ItemMenu, on_delete=models.CASCADE)
    quantidade = models.IntegerField(default=1)
    observacao = models.TextField(blank=True, default='')

    def __str__(self):
        return f"{self.quantidade}x {self.item_menu.nome}"
