/* =========================================================
   DATA PORTOFOLIO — edit di sini saja.
   ========================================================= */

/* ---------- SELECTED WORK ----------
   Satu daftar untuk semua proyek & web. Tambah proyek baru dengan menyalin
   satu blok { ... }. Field:
     title    : judul proyek
     client   : klien / pemberi kerja / platform
     meta     : deskripsi singkat (1–2 kalimat)
     cat      : "geoai", "twin" (Digital Twin & Web) atau "map" (Mapping & Survey) — dipakai filter
     img      : gambar, mis. "assets/img/work/nama.webp" — kosongkan "" kalau belum ada
                Saat MENGGANTI gambar, pakai nama file baru (mis. nama-v2.webp) supaya
                browser pengunjung tidak menampilkan versi lama dari cache.
     url      : (opsional) link web live → muncul badge "Live" & tombol "Visit live"
     repo     : (opsional) link kode sumber (GitHub) → tombol "Source code"
     award    : (opsional) penghargaan, tampil sebagai badge
     size     : (opsional) "full" → kartu banner selebar grid
     noZoom   : (opsional) true → kartu tidak bisa diklik / diperbesar
     featured : (opsional) true → kartu lebar. Usahakan jumlah kartu lebar
                genap per kategori supaya grid tetap rapi.
*/
window.WORKS = [
  {
    title: "Land Cover Mapping & Pepper Plant Detection",
    client: "PT Vale Indonesia",
    meta: "U-Net land cover from Sentinel-2 & UAV (~87% OA, >15 km²) plus object detection to count pepper plants across concession areas.",
    cat: "geoai",
    img: "assets/img/work/vale-pepper.webp",
    featured: true
  },
  {
    title: "National Land Cover Monitoring for HGU Concessions",
    client: "Ministry of ATR/BPN · DG PPTR",
    meta: "Indonesia-wide land cover detection platform to monitor how Right-to-Cultivate (HGU) land is actually being used.",
    cat: "geoai",
    img: "assets/img/work/hgu-landcover.webp"
  },
  {
    title: "Automated Rooftop Extraction",
    client: "Ministry of ATR/BPN · DG SPPR",
    meta: "Resolution-adaptive YOLO-seg pipeline with roof regularisation: up to 0.87 IoU (mean 0.74 over 6 test areas) from 5 to 50 cm GSD, cutting manual digitisation by ~80%.",
    cat: "geoai",
    img: "assets/img/work/roof-extraction.webp"
  },
  {
    title: "Rooftop Solar Potential & Property Tax Estimation",
    client: "ASEAN Geospatial Challenge 2026",
    award: "1st Place",
    meta: "Segments roofs and existing panels from UAV imagery, then estimates each building's kWp, energy savings and property tax value.",
    cat: "geoai",
    img: "assets/img/work/solar-dashboard.webp",
    featured: true
  },
  {
    title: "Label-Efficient Road Network Extraction",
    client: "Research & Development · Open Source",
    meta: "SAM3 + OpenStreetMap pseudo-labels fine-tune a satellite DINOv3 on a 4 GB GPU, with no manual labels. 0.94 recall on a held-out Bekasi tile (vs 0.58 zero-shot), with a 966 km connected road graph, road widths and new-road candidates.",
    cat: "geoai",
    img: "assets/img/work/road-graph.webp",
    repo: "https://github.com/RaffiSatya/road-detection-sam3-dinov3"
  },
  {
    title: "Cloud-Free Sentinel-2 Super-Resolution",
    client: "Research & Development",
    meta: "Web app that turns 10 m Sentinel-2 into 2.5 m analysis-grade or 1.25 m visual imagery, with automatic cloud masking and a before/after slider. 13 SR methods benchmarked across 5 Indonesian areas and checked against Maxar imagery.",
    cat: "geoai",
    img: "assets/img/work/super-resolution.webp",
    featured: true
  },
  {
    title: "Cartography, Remote Sensing & Survey Atlas",
    client: "Client & Academic Mapping Projects",
    meta: "19 map sheets across Indonesia: village and administrative maps, disaster-risk zoning, geology, soil, land use and IKN land transformation, from 1:500 site plans to regional scales.",
    cat: "map",
    img: "assets/img/work/map-atlas.webp",
    size: "full",
    noZoom: true
  },
  {
    title: "Heritage Digital Twin of the Cosmological Axis of Yogyakarta",
    client: "Cultural Office of Yogyakarta City",
    meta: "3D models, WebGIS and historical narrative of the UNESCO-listed Philosophical Axis, unified in one digital record.",
    cat: "twin",
    img: "assets/img/work/heritage-catalog.webp",
    url: "https://heritage.geotwinverse.ai/",
    featured: true
  },
  {
    title: "3D Volcano Digital Twin",
    client: "Geo-AI Twinverse",
    meta: "3D digital twin of Mount Agung and Kelud. Multi-epoch UAV terrain, Gaussian Splats and slice comparison show how each eruption reshapes the crater.",
    cat: "twin",
    img: "assets/img/web/volcano.webp",
    url: "https://new-volcano3d.geotwinverse.ai/"
  },
  {
    title: "3D Campus Digital Twin, FT UGM",
    client: "Geo-AI Twinverse",
    meta: "Digital twin of the Faculty of Engineering UGM. Explore the ERIC, SGLC and DTSL buildings room by room in 3D, straight from the campus map.",
    cat: "twin",
    img: "assets/img/web/teknik-3d.webp",
    url: "https://new-3dteknik.geotwinverse.ai/"
  },
  {
    title: "Simpul Jogja: Real-Time Transit Twin",
    client: "Geo-AI Twinverse",
    meta: "Live public-transport digital twin for Yogyakarta: Trans Jogja, KRL, airport rail, Prameks and long-distance trains on one map.",
    cat: "twin",
    img: "assets/img/web/simpul-live.webp",
    url: "https://simpul.geotwinverse.ai/"
  },
  {
    title: "GeoAI Peduli: Disaster Impact Mapping",
    client: "Geo-AI Twinverse",
    meta: "Satellite imagery and AI map disaster impact: Sumatra floods, forest and land cover change, and wildfire smoke, each in its own dashboard.",
    cat: "twin",
    img: "assets/img/web/geoaipeduli-fires.webp",
    url: "https://new-geoaipeduli.geotwinverse.ai/"
  }
];

/* ---------- PUBLICATIONS ----------
   Isi kalau sudah ada. Section "Publications" otomatis muncul begitu daftar ini tidak kosong.
     title   : judul artikel
     authors : daftar penulis sesuai urutan; tulis namamu persis "Raffi Satya Nugraha" agar ditebalkan
     venue   : nama jurnal / konferensi (+ volume, nomor)
     year    : tahun
     status  : "Published" | "In press" | "Accepted" | "Presented" | "Under review"
     note    : (opsional) keterangan tambahan, mis. "Proceedings under review"
     index   : (opsional) mis. "Scopus Q2", "SINTA 2"
     url     : (opsional) link DOI / artikel — hanya untuk yang sudah terbit
*/
window.PUBLICATIONS = [
  {
    title: "Single-image versus reference-guided super-resolution configurations for Sentinel-2 land cover semantic segmentation: a multi-sensor, task-based evaluation",
    authors: ["Raffi Satya Nugraha", "Ruli Andaru"],
    venue: "Frontiers in Earth Science, 14:1983076",
    year: "2026",
    status: "Accepted"
  },
  {
    title: "Hierarchical AI-based patch inference for rooftop solar segmentation and photovoltaic feasibility assessment",
    authors: ["Mohammad Zulfi Rahadi Putra", "Raffi Satya Nugraha", "Fikri Kurniawan", "Ruli Andaru", "Fairuz Akmal Pradana", "Hyatma Adikara Ajrin"],
    venue: "IEEE ICARES",
    year: "2026",
    status: "Presented",
    note: "Proceedings under review"
  },
  {
    title: "Spectral and spatial feature augmentation for SegFormer land cover segmentation of UAV RGB imagery: a spatially independent evaluation",
    authors: ["Mohammad Zulfi Rahadi Putra", "Ruli Andaru", "Raffi Satya Nugraha", "Fikri Kurniawan", "Urmila Zulfaa Khairunnisa", "Lidwina Galuh Putri", "Thoriq Agil Muhammad"],
    venue: "IOP Conference Series: Earth and Environmental Science",
    year: "2026",
    status: "Presented",
    note: "Proceedings under review"
  },
  {
    title: "Nusantara Heritage Map: a 3D WebGIS heritage digital twin for the Yogyakarta Cosmological Axis",
    authors: ["Ruli Andaru", "Megan Rahmadiansyah", "Mohammad Zulfi Rahadi Putra", "Bernardinus Realino Justin Novandri Priambudi", "Dhias Muhammad Naufal", "Berlian Ratri", "Raffi Satya Nugraha", "Trias Aditya Kurniawan Muhammad", "Yulaikhah", "Bambang Kun Cahyono", "Rochmad Muryamto", "Catur Aries Rokhmana", "Calvin Wijaya", "Abdul Basith", "Nurrohmat Widjajanti", "Purnama Budi Santosa", "Harintaka"],
    venue: "HIDIT, IPB University",
    year: "2026",
    status: "Presented",
    note: "Proceedings under review"
  }
];

/* ---------- INTELLECTUAL PROPERTY (HAKI) ----------
     title    : judul (bahasa Inggris)
     original : judul resmi di sertifikat
     type     : jenis HKI
     number   : nomor pencatatan / sertifikat
     year     : tahun pencatatan
     holder   : pemegang hak
*/
window.IP = [
  {
    title: "NARAGA: Cloud Platform Integrating GeoAI, 3D Modelling and Digital Twin for National Geospatial Analysis",
    original: "Platform Integrasi GeoAI, 3D Modeling, dan Digital Twin untuk Analisis Geospasial Nasional berbasis Cloud Processing: NARAGA",
    type: "Copyright · Computer Program",
    number: "001305988",
    year: "2026",
    holder: "Universitas Gadjah Mada"
  },
  {
    title: "Geospatial-AI Cloud Processing Platform for Plantation Crop Detection and Counting",
    original: "Platform Cloud Processing untuk Deteksi dan Counting Tanaman Perkebunan berbasis Geospatial-AI",
    type: "Copyright · Computer Program",
    number: "001291057",
    year: "2026",
    holder: "Universitas Gadjah Mada"
  }
];
