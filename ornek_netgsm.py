import requests
import os

# ============================================
# BURAYA KENDİ BİLGİLERİNİZİ GİRİN
# ============================================

# usercode: Ana abone numaranız (850xxxxxxx formatında)
ABONE_NUMARASI = "8503038287"

# password: API yetkisi tanımlı alt kullanıcı şifresi
ALT_KULLANICI_SIFRESI = "a9-a373r"

# Aranacak telefon numaraları
NUMARALAR = [
    "905468830633",
    "905301433342",
]

# MP3 dosyasının yolu (örnek: "ses_dosyam.mp3")
MP3_DOSYA_YOLU = "erkeksesi.wav"


# ============================================
# PROGRAM
# ============================================

def mp3_yukle():
    """MP3/WAV dosyasını NetGSM'e yükler ve audioid döner"""
    
    print("📁 Ses dosyası yükleniyor...")
    print(f"   Dosya: {MP3_DOSYA_YOLU}")
    print()
    
    # Dosya kontrolü
    if not os.path.exists(MP3_DOSYA_YOLU):
        print(f"❌ HATA: '{MP3_DOSYA_YOLU}' dosyası bulunamadı!")
        print("   Lütfen dosya yolunu kontrol edin.")
        return None
    
    try:
        # Ses dosyasını oku
        with open(MP3_DOSYA_YOLU, 'rb') as f:
            dosya_data = f.read()
        
        # Dosya uzantısına göre MIME type belirle
        dosya_adi = os.path.basename(MP3_DOSYA_YOLU)
        if dosya_adi.lower().endswith('.mp3'):
            mime_type = 'audio/mpeg'
        elif dosya_adi.lower().endswith('.wav'):
            mime_type = 'audio/wav'
        else:
            mime_type = 'application/octet-stream'
        
        
        files = {
            'dosya': (dosya_adi, dosya_data, mime_type)
        }
        
        data = {
            'username': ABONE_NUMARASI,  # PHP'de 'username' kullanılıyor
            'password': ALT_KULLANICI_SIFRESI
        }
        
        # API'ye yükleme isteği gönder
        response = requests.post(
            'https://api.netgsm.com.tr/voicesms/upload',
            files=files,
            data=data,
            timeout=60
        )
        
        sonuc = response.text.strip()
        
        print(f"📨 Yükleme Yanıtı: '{sonuc}'")
        print()
        
        # Yanıtı değerlendir
        # Eğer sadece rakamlardan oluşuyorsa, bu Audio ID'dir (başarılı)
        if sonuc.isdigit():
            audioid = sonuc
            print(f"✅ Dosya başarıyla yüklendi!")
            print(f"   Audio ID: {audioid}")
            print()
            return audioid
            
        elif sonuc.startswith('00'):
            audioid = sonuc.split()[1] if len(sonuc.split()) > 1 else None
            print(f"✅ Dosya başarıyla yüklendi!")
            print(f"   Audio ID: {audioid}")
            print()
            return audioid
            
        elif sonuc == '30':
            print("❌ HATA 30: Geçersiz kullanıcı adı veya şifre")
            print()
            print("Kontrol edin:")
            print(f"  • username = {ABONE_NUMARASI}")
            print(f"  • password = (şifre)")
            print(f"  • Alt kullanıcıya 'Sesli Mesaj Gönderme' yetkisi verildi mi?")
            print(f"  • IP kısıtlaması var mı?")
            return None
            
        elif sonuc == '40':
            print("❌ HATA 40: Ses dosyası yüklenemedi (format hatası olabilir)")
            print("   Desteklenen formatlar: MP3, WAV")
            return None
            
        elif sonuc == '50':
            print("❌ HATA 50: Ses dosyası boyutu çok büyük (max 2MB)")
            return None
            
        else:
            print(f"⚠️  Beklenmeyen yanıt: {sonuc}")
            return None
            
    except Exception as e:
        print(f"❌ Dosya Yükleme Hatası: {e}")
        import traceback
        traceback.print_exc()
        return None


def sesli_arama_gonder(audioid):
    """NetGSM Sesli Arama Gönderimi (Ses dosyası ile)"""
    
    print("=" * 60)
    print("  NetGSM Sesli Arama Gönderimi")
    print("=" * 60)
    print()
    print(f"Abone Numarası: {ABONE_NUMARASI}")
    print(f"Audio ID: {audioid}")
    print(f"Aranacak Numara Sayısı: {len(NUMARALAR)}")
    print()
    
    # Telefon numaralarını XML formatına çevir
    numara_xml = '\n'.join([f'<no>{num}</no>' for num in NUMARALAR])
    
    # XML oluştur (başarılı örneğe göre - key parametresi ve audioid yerleşimi)
    xml = f"""<?xml version='1.0' encoding='UTF-8'?>
<mainbody>
<header>
<usercode>{ABONE_NUMARASI}</usercode>
<password>{ALT_KULLANICI_SIFRESI}</password>
<key>0</key>
</header>
<body>
<audioid>{audioid}</audioid>
{numara_xml}
</body>
</mainbody>"""
    
    print("📤 API'ye arama isteği gönderiliyor...")
    print()
    
    try:
        # HTTP POST isteği
        headers = {'Content-Type': 'application/xml; charset=utf-8'}
        
        response = requests.post(
            'https://api.netgsm.com.tr/voicesms/send',
            data=xml.encode('utf-8'),
            headers=headers,
            timeout=30
        )
        
        # Yanıtı al
        sonuc = response.text.strip()
        
        print(f"📨 Sunucu Yanıtı: '{sonuc}'")
        print()
        
        # Yanıtı değerlendir
        if sonuc.startswith('00'):
            print("✅ BAŞARILI!")
            print(f"   Görev ID: {sonuc.split()[1] if len(sonuc.split()) > 1 else 'Bilinmiyor'}")
            print("   Aramalar birkaç dakika içinde başlayacak.")
            print("   Ses dosyanız çalınacak.")
            
        elif sonuc.startswith('01'):
            print("✅ BAŞARILI (Başlangıç tarihi sistem tarihi ile değiştirildi)")
            print(f"   Görev ID: {sonuc.split()[1] if len(sonuc.split()) > 1 else 'Bilinmiyor'}")
            
        elif sonuc.startswith('02'):
            print("✅ BAŞARILI (Bitiş tarihi sistem tarihi ile değiştirildi)")
            print(f"   Görev ID: {sonuc.split()[1] if len(sonuc.split()) > 1 else 'Bilinmiyor'}")
            
        elif sonuc == '30':
            print("❌ HATA 30: Geçersiz kullanıcı adı, şifre veya API erişim izni yok")
            print()
            print("Kontrol edin:")
            print(f"  • usercode = {ABONE_NUMARASI} (Ana abone numaranız doğru mu?)")
            print(f"  • password = Alt kullanıcı şifresi doğru mu?")
            print(f"  • Alt kullanıcıya 'Sesli Mesaj Gönderme' yetkisi verildi mi?")
            
        elif sonuc == '40':
            print("❌ HATA 40: Ses dosyası bulunamadı")
            print(f"   Audio ID ({audioid}) geçersiz veya silinmiş olabilir")
            
        elif sonuc == '45':
            print("❌ HATA 45: Gönderilecek telefon numarası bulunamadı")
            
        elif sonuc == '70':
            print("❌ HATA 70: XML formatı hatalı veya zorunlu parametre eksik")
            
        else:
            print(f"⚠️  Beklenmeyen yanıt: {sonuc}")
        
    except Exception as e:
        print(f"❌ Bağlantı Hatası: {e}")
        import traceback
        traceback.print_exc()
    
    print()
    print("=" * 60)


# ============================================
# PROGRAMI ÇALIŞTIR
# ============================================

if __name__ == '__main__':
    print("=" * 60)
    print("  NetGSM Ses Dosyası ile Sesli Arama Gönderimi")
    print("=" * 60)
    print()
    
    # 1. Adım: Ses dosyasını yükle
    audioid = mp3_yukle()
    
    if audioid:
        print()
        # 2. Adım: Sesli aramayı gönder
        sesli_arama_gonder(audioid)
    else:
        print("❌ Ses dosyası yüklenemediği için arama gönderilemedi.")
        print()