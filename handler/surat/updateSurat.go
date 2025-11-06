package surat

import (
	"api-jumantik/config"
	"api-jumantik/model"
	"context"
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
)

func UpdateSurat(c *gin.Context) {
	id := c.Param("id")
	role := c.GetString("role")

	if role != "koordinator" {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	var surat model.UpdateSurat
	if err := c.ShouldBindJSON(&surat); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	totalBangunan := surat.JenisTatanan.RumahTangga.Dikunjungi +
		surat.JenisTatanan.Perkantoran.Dikunjungi +
		surat.JenisTatanan.InstPendidikan.Dikunjungi +
		surat.JenisTatanan.TTU.Dikunjungi +
		surat.JenisTatanan.FasOlahraga.Dikunjungi +
		surat.JenisTatanan.TPM.Dikunjungi +
		surat.JenisTatanan.FasKesehatan.Dikunjungi

	totalJentik := surat.JenisTatanan.RumahTangga.Positif +
		surat.JenisTatanan.Perkantoran.Positif +
		surat.JenisTatanan.InstPendidikan.Positif +
		surat.JenisTatanan.TTU.Positif +
		surat.JenisTatanan.FasOlahraga.Positif +
		surat.JenisTatanan.TPM.Positif +
		surat.JenisTatanan.FasKesehatan.Positif

	surat.TotalBangunan = totalBangunan
	surat.TotalJentik = totalJentik

	// 🔹 Hitung ABJ otomatis
	if totalBangunan > 0 {
		surat.ABJ = float32(float64(totalBangunan-totalJentik) / float64(totalBangunan) * 100)
	}

	// 🔹 Konversi struct ke JSON string
	jumlahJSON, err := json.Marshal(surat.Jumlah)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal konversi jumlah ke JSON"})
		return
	}

	jenisTatananJSON, err := json.Marshal(surat.JenisTatanan)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal konversi jenis_tatanan ke JSON"})
		return
	}

	// 🔹 Update data surat
	query := `UPDATE surat SET rt=$1, jumlah=$2::jsonb, jenis_tatanan=$3::jsonb, total_bangunan=$4, total_jentik=$5, abj=$6 WHERE id=$7`

	_, err = config.Pool.Exec(
		context.Background(),
		query,
		surat.RT,
		string(jumlahJSON),
		string(jenisTatananJSON),
		surat.TotalBangunan,
		surat.TotalJentik,
		surat.ABJ,
		id,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Surat berhasil diperbarui"})
}
