package model

type GetSuratRequest struct {
	TanggalID int `json:"tanggal_id"`
}

// Struktur respon tiap surat
type SuratData struct {
	RT            int                    `json:"rt"`
	Jumantik      int                    `json:"jumantik"`
	Melapor       int                    `json:"melapor"`
	JenisTatanan  map[string]interface{} `json:"jenis_tatanan"`
	TotalBangunan int                    `json:"total_bangunan"`
	TotalJentik   int                    `json:"total_jentik"`
	ABJ           string                 `json:"abj"`
}

// Struktur total keseluruhan
type TotalData struct {
	Jumantik      int                       `json:"jumantik"`
	Melapor       int                       `json:"melapor"`
	JenisTatanan  map[string]map[string]int `json:"jenis_tatanan"`
	TotalBangunan int                       `json:"total_bangunan"`
	TotalJentik   int                       `json:"total_jentik"`
	ABJ           string                    `json:"abj"`
}

type GetSuratAdminRequest struct {
	Tanggal string `json:"tanggal"`
}

type RWData struct {
	RW            int                       `json:"rw"`
	Jumantik      int                       `json:"jumantik"`
	Melapor       int                       `json:"melapor"`
	JenisTatanan  map[string]map[string]int `json:"jenis_tatanan"`
	TotalBangunan int                       `json:"total_bangunan"`
	TotalJentik   int                       `json:"total_jentik"`
	ABJ           string                    `json:"abj"`
}
