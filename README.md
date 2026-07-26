# PROMPTLA

PROMPTLA; yapay zekâ araçları, terminal kullanımı, otomasyon rehberleri ve profesyonel prompt kütüphanesini bir araya getiren statik bir web projesidir.

## Öne çıkan bölümler

- AI Studio: Claude Code, OpenAI Codex, n8n ve MCP rehberleri
- Etkileşimli terminal laboratuvarı
- 60 farklı prompt ve her promptun birebir sonucunu gösteren özgün yerel WebP görseli
- Prompt Builder
- Yerel hesap, favori ve kayıtlı prompt sistemi
- Mobil uyumlu, kaydırma davranışları iyileştirilmiş navbar
- Tasarım bütünlüğünü koruyan kalıcı koyu tema

## Çalıştırma

Herhangi bir kurulum gerekmez. Depoyu indirdikten sonra `index.html` dosyasını tarayıcıda açın.

```bash
git clone <REPO_URL>
cd promptla
```

Ardından `index.html` dosyasına çift tıklayın.

## Klasör yapısı

```text
promptla/
├── index.html              # Ana sayfa
├── 404.html                # Hata sayfası
├── pages/                  # Tüm içerik ve rehber sayfaları
├── games/                  # Mini oyunlar ve oyun merkezi
├── assets/
│   ├── css/                # Stil dosyaları
│   └── js/                 # JavaScript dosyaları
├── images/                 # Görseller ve prompt sonuçları
├── docs/                   # Sürüm notları ve kurulum notları
├── robots.txt
├── sitemap.xml
└── site.webmanifest
```

## Teknolojiler

- HTML5
- CSS3
- Vanilla JavaScript
- LocalStorage

Projede PHP, MySQL, Firebase veya başka bir uzak veritabanı bağlantısı bulunmaz.

## Veri saklama

Hesap, favori, beğeni, yorum ve kayıtlı prompt verileri yalnızca kullanıcının tarayıcısındaki `localStorage` alanında tutulur. Farklı cihazlar arasında senkronizasyon yapılmaz.

## GitHub Pages

Depo ayarlarında **Settings → Pages → Deploy from a branch** seçilerek `main` dalının kök dizini yayınlanabilir.

## Bağlantılar

LinkedIn ve GitHub adresleri `assets/js/site-links.js` dosyasından güncellenebilir.
