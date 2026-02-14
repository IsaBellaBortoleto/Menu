# Script para comprimir todas as imagens para WebP

$imagemDir = "d:\Bella\UTFPR\4.2_periodo\github\Menu\public\imagens"
Set-Location $imagemDir

Write-Host "🔄 Comprimindo imagens para WebP..." -ForegroundColor Cyan
Write-Host "Diretório: $imagemDir`n" -ForegroundColor Gray

$conversoes = @(
    @("SanduicheChicken.jpg", "SanduicheChicken.webp"),
    @("SanduicheFish.jpg", "SanduicheFish.webp"),
    @("SanduicheTradicional.jpg", "SanduicheTradicional.webp"),
    @("HotDogTradicional.png", "HotDogTradicional.webp"),
    @("HotDogFrango.png", "HotDogFrango.webp"),
    @("HotDogNaoTradicional.png", "HotDogNaoTradicional.webp"),
    @("PizzaCalabresa.jpg", "PizzaCalabresa.webp"),
    @("PizzaFrango.jpg", "PizzaFrango.webp"),
    @("PizzaRicota.webp", "PizzaRicota.webp"),
    @("CocaCola.jpg", "CocaCola.webp"),
    @("Guarana.jpg", "Guarana.webp"),
    @("SucoVale.jpg", "SucoVale.webp"),
    @("MilkshakeChocolatudo.jpg", "MilkshakeChocolatudo.webp"),
    @("MilkshakeMoranguete.jpg", "MilkshakeMoranguete.webp"),
    @("MilkshakeKitKat.jpg", "MilkshakeKitKat.webp")
)

$totalEconomia = 0
$totalAntes = 0
$totalDepois = 0

foreach ($conversao in $conversoes) {
    $origem = $conversao[0]
    $destino = $conversao[1]
    
    if (Test-Path $origem) {
        $sizeBefore = [math]::Round((Get-Item $origem).Length / 1KB, 2)
        $totalAntes += $sizeBefore
        
        Write-Host "🔄 Convertendo: $origem → $destino" -ForegroundColor Yellow
        magick convert $origem -quality 80 -resize 800x600 $destino
        
        if (Test-Path $destino) {
            $sizeAfter = [math]::Round((Get-Item $destino).Length / 1KB, 2)
            $totalDepois += $sizeAfter
            $economy = [math]::Round((1 - ($sizeAfter / $sizeBefore)) * 100, 1)
            $totalEconomia += ($sizeBefore - $sizeAfter)
            
            Write-Host "   ✅ $origem: $sizeBefore KB → $sizeAfter KB (economia: $economy%)" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Falha ao converter $origem" -ForegroundColor Red
        }
    } else {
        Write-Host "   ⚠️  Arquivo não encontrado: $origem" -ForegroundColor Yellow
    }
}

Write-Host "`n" -ForegroundColor Green
Write-Host "════════════════════════════════════════" -ForegroundColor Green
Write-Host "✅ COMPRESSÃO COMPLETA!" -ForegroundColor Green
Write-Host "════════════════════════════════════════" -ForegroundColor Green
Write-Host "Tamanho total ANTES: $([math]::Round($totalAntes / 1024, 2)) MB" -ForegroundColor Cyan
Write-Host "Tamanho total DEPOIS: $([math]::Round($totalDepois / 1024, 2)) MB" -ForegroundColor Cyan
Write-Host "Economia total: $([math]::Round($totalEconomia / 1024, 2)) MB" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════" -ForegroundColor Green