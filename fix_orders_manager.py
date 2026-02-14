import re

path = r"D:\Bella\UTFPR\4.2_periodo\github\Menu\src\components\admin\OrdersManager.tsx"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace preco_unitario with preco_item
content = content.replace("item.preco_unitario", "item.preco_item")

# Replace item.item_nome with item.nome_item  
content = content.replace("item.item_nome", "item.nome_item")

# Now replace the entire map function
old_map = """order.itens?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between text-sm bg-background p-2 rounded"
                  >
                    <span>
                      {item.quantidade}x {item.nome_item}
                    </span>
                    <span className="font-medium">
                      R$ {(item.quantidade * parseFloat(item.preco_item)).toFixed(2)}
                    </span>
                  </div>
                ))"""

new_map = """order.itens && order.itens.length > 0 ? (
                  order.itens.map((item, idx) => {
                    const precoUnitario = typeof item.preco_item === 'string'
                      ? parseFloat(item.preco_item)
                      : item.preco_item || 0;
                    return (
                      <div
                        key={idx}
                        className="flex justify-between text-sm bg-background p-2 rounded"
                      >
                        <span>
                          {item.quantidade}x {item.nome_item}
                        </span>
                        <span className="font-medium">
                          R$ {(item.quantidade * precoUnitario).toFixed(2)}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-muted-foreground italic">Sem itens registrados</p>
                )"""

content = content.replace(old_map, new_map)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ OrdersManager.tsx atualizado com sucesso!")
