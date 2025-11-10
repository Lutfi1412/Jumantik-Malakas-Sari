package model

// Struktur jumlah laporan
type Jumlah struct {
	Jumantik int `json:"jumantik"`
	Melapor  int `json:"melapor"`
}

// Struktur jenis tatanan
type JenisTatanan struct {
	RumahTangga    Tatanan `json:"rumah_tangga"`
	Perkantoran    Tatanan `json:"perkantoran"`
	InstPendidikan Tatanan `json:"inst_pendidikan"`
	TTU            Tatanan `json:"ttu"`
	FasOlahraga    Tatanan `json:"fas_olahraga"`
	TPM            Tatanan `json:"tpm"`
	FasKesehatan   Tatanan `json:"fas_kesehatan"`
}

// Struktur tiap tatanan
type Tatanan struct {
	Dikunjungi int `json:"dikunjungi"`
	Positif    int `json:"positif"`
}

// Data surat
type CreateSurat struct {
	TanggalID     int          `json:"tanggal_id"`
	RT            int          `json:"rt"`
	TotalBangunan int          `json:"total_bangunan"`
	TotalJentik   int          `json:"total_jentik"`
	ABJ           float32      `json:"abj"`
	Jumlah        Jumlah       `json:"jumlah"`
	JenisTatanan  JenisTatanan `json:"jenis_tatanan"`
}

type UpdateSurat struct {
	RT            int          `json:"rt"`
	TotalBangunan int          `json:"total_bangunan"`
	TotalJentik   int          `json:"total_jentik"`
	ABJ           float32      `json:"abj"`
	Jumlah        Jumlah       `json:"jumlah"`
	JenisTatanan  JenisTatanan `json:"jenis_tatanan"`
}

type CreateTanggal struct {
	Tanggal string `json:"tanggal"`
}

type DeleteTanggal struct {
	IDs []int `json:"ids"`
}

type TanggalData struct {
	ID      int    `json:"id"`
	Tanggal string `json:"tanggal"`
}

type GetRW struct {
	ID int `json:"id"`
	RW int `json:"rw"`
}
