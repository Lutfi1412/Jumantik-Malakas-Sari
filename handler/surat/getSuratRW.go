package surat

import (
	"api-jumantik/config"
	"api-jumantik/model"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"sort"

	"github.com/gin-gonic/gin"
)

// Handler
func GetSuratRW(c *gin.Context) {
	ID := c.GetString("id") // dari JWT, ini hashing_id user login
	Role := c.GetString("role")

	var input model.GetSuratRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid payload"})
		return
	}

	if Role != "admin" && Role != "koordinator" {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	var userRW int
	err := config.Pool.QueryRow(context.Background(),
		`SELECT rw FROM users WHERE hashing_id = $1`, ID,
	).Scan(&userRW)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "User tidak valid"})
		return
	}

	// Ambil tanggal dan RW dari tabel tanggal
	var tanggal string
	var rwTanggal int
	err = config.Pool.QueryRow(context.Background(),
		`SELECT tanggal, rw FROM tanggal WHERE id = $1`, input.TanggalID,
	).Scan(&tanggal, &rwTanggal)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Tanggal tidak ditemukan"})
		return
	}

	// Cek apakah RW tanggal sama dengan RW user login
	if rwTanggal != userRW && userRW != 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Tidak boleh akses data RW lain"})
		return
	}

	// Ambil semua surat berdasarkan tanggal_id
	rows, err := config.Pool.Query(context.Background(), `
		SELECT id, rt, jumlah, jenis_tatanan, total_bangunan, total_jentik, abj 
		FROM surat 
		WHERE tanggal_id = $1
	`, input.TanggalID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Gagal mengambil data surat: " + err.Error()})
		return
	}
	defer rows.Close()

	var dataList []model.SuratData
	total := model.TotalData{
		JenisTatanan: map[string]map[string]int{
			"rumah_tangga":    {"dikunjungi": 0, "positif": 0},
			"perkantoran":     {"dikunjungi": 0, "positif": 0},
			"inst_pendidikan": {"dikunjungi": 0, "positif": 0},
			"ttu":             {"dikunjungi": 0, "positif": 0},
			"fas_olahraga":    {"dikunjungi": 0, "positif": 0},
			"tpm":             {"dikunjungi": 0, "positif": 0},
			"fas_kesehatan":   {"dikunjungi": 0, "positif": 0},
		},
	}

	for rows.Next() {
		var id, rt, totalBangunan, totalJentik int
		var abjFloat float32
		var jumlahJSON, jenisJSON []byte

		if err := rows.Scan(&id, &rt, &jumlahJSON, &jenisJSON, &totalBangunan, &totalJentik, &abjFloat); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
			return
		}

		var jumlah map[string]int
		if err := json.Unmarshal(jumlahJSON, &jumlah); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Gagal parsing jumlah"})
			return
		}

		var jenis map[string]map[string]int
		if err := json.Unmarshal(jenisJSON, &jenis); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Gagal parsing jenis_tatanan"})
			return
		}

		total.Jumantik += jumlah["jumantik"]
		total.Melapor += jumlah["melapor"]
		total.TotalBangunan += totalBangunan
		total.TotalJentik += totalJentik

		for key, val := range jenis {
			if t, ok := total.JenisTatanan[key]; ok {
				t["dikunjungi"] += val["dikunjungi"]
				t["positif"] += val["positif"]
			}
		}

		dataList = append(dataList, model.SuratData{
			ID:            id,
			RT:            rt,
			Jumantik:      jumlah["jumantik"],
			Melapor:       jumlah["melapor"],
			JenisTatanan:  convertJenis(valToAnyMap(jenis)),
			TotalBangunan: totalBangunan,
			TotalJentik:   totalJentik,
			ABJ:           fmt.Sprintf("%.1f%%", abjFloat),
		})
	}

	if total.TotalBangunan > 0 {
		total.ABJ = fmt.Sprintf("%.1f%%", float64(total.TotalBangunan-total.TotalJentik)/float64(total.TotalBangunan)*100)
	}

	sort.Slice(dataList, func(i, j int) bool {
		return dataList[i].RT < dataList[j].RT
	})

	c.JSON(http.StatusOK, gin.H{
		"data":    dataList,
		"total":   total,
		"tanggal": tanggal,
		"rw":      rwTanggal,
	})
}

// Helper
func convertJenis(m map[string]map[string]int) map[string]interface{} {
	out := make(map[string]interface{})
	for k, v := range m {
		out[k] = v
	}
	return out
}

func valToAnyMap(m map[string]map[string]int) map[string]map[string]int {
	return m
}
