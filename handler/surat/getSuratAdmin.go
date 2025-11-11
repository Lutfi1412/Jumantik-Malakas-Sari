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

type JenisTatanan map[string]map[string]int

func GetSuratAdmin(c *gin.Context) {

	role := c.GetString("role")

	if role != "admin" {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Tidak diizinkan. Hanya admin yang dapat mengakses data surat."})
		return
	}
	var input model.GetSuratAdminRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Format data tidak valid"})
		return
	}

	ctx := context.Background()

	rows, err := config.Pool.Query(ctx, `SELECT id, rw FROM tanggal WHERE tanggal = $1`, input.Tanggal)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Gagal mengambil data tanggal"})
		return
	}
	defer rows.Close()

	rwMap := make(map[int]int) // tanggal_id -> rw
	for rows.Next() {
		var id, rw int
		if err := rows.Scan(&id, &rw); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Gagal membaca data tanggal"})
			return
		}
		rwMap[id] = rw
	}

	if len(rwMap) == 0 {
		c.JSON(http.StatusOK, gin.H{"data": []interface{}{}, "total": gin.H{}, "tanggal": input.Tanggal})
		return
	}

	// 🔹 Ambil semua surat yang tanggal_id ada di rwMap
	rows2, err := config.Pool.Query(ctx, `
		SELECT tanggal_id, jumlah, jenis_tatanan, total_bangunan, total_jentik, abj
		FROM surat
		WHERE tanggal_id = ANY($1)
	`, arrayKeys(rwMap))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Gagal mengambil data surat"})
		return
	}
	defer rows2.Close()

	// 🔹 Inisialisasi total keseluruhan
	// 🔹 Inisialisasi total keseluruhan
	totalKeseluruhan := model.TotalData{
		JenisTatanan: initJenisTatanan(),
	}

	// 🔹 Map RW -> Data akumulasi
	grouped := make(map[int]*model.RWData)

	for rows2.Next() {
		var tanggalID, totalBangunan, totalJentik int
		var abj float32
		var jumlahJSON, jenisJSON []byte

		err := rows2.Scan(&tanggalID, &jumlahJSON, &jenisJSON, &totalBangunan, &totalJentik, &abj)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Gagal membaca data surat"})
			return
		}

		rw, ok := rwMap[tanggalID]
		if !ok {
			continue
		}

		var jumlah map[string]int
		var jenis JenisTatanan
		if err := json.Unmarshal(jumlahJSON, &jumlah); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Gagal membaca data jumlah"})
			return
		}
		if err := json.Unmarshal(jenisJSON, &jenis); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Gagal membaca data jenis tatanan"})
			return
		}

		// 🔹 Tambahkan ke RW tertentu
		if _, exists := grouped[rw]; !exists {
			grouped[rw] = &model.RWData{
				RW:           rw,
				JenisTatanan: initJenisTatanan(),
			}
		}
		data := grouped[rw]
		data.Jumantik += jumlah["jumantik"]
		data.Melapor += jumlah["melapor"]
		data.TotalBangunan += totalBangunan
		data.TotalJentik += totalJentik

		for key, val := range jenis {
			data.JenisTatanan[key]["dikunjungi"] += val["dikunjungi"]
			data.JenisTatanan[key]["positif"] += val["positif"]
		}
	}

	// 🔹 Hitung ABJ per RW
	for _, d := range grouped {
		if d.TotalBangunan > 0 {
			d.ABJ = fmt.Sprintf("%.1f%%", float64(d.TotalBangunan-d.TotalJentik)/float64(d.TotalBangunan)*100)
		} else {
			d.ABJ = "0%"
		}

		totalKeseluruhan.Jumantik += d.Jumantik
		totalKeseluruhan.Melapor += d.Melapor
		totalKeseluruhan.TotalBangunan += d.TotalBangunan
		totalKeseluruhan.TotalJentik += d.TotalJentik

		for key, val := range d.JenisTatanan {
			totalKeseluruhan.JenisTatanan[key]["dikunjungi"] += val["dikunjungi"]
			totalKeseluruhan.JenisTatanan[key]["positif"] += val["positif"]
		}
	}

	// 🔹 Hitung ABJ total
	if totalKeseluruhan.TotalBangunan > 0 {
		totalKeseluruhan.ABJ = fmt.Sprintf("%.1f%%", float64(totalKeseluruhan.TotalBangunan-totalKeseluruhan.TotalJentik)/float64(totalKeseluruhan.TotalBangunan)*100)
	} else {
		totalKeseluruhan.ABJ = "0%"
	}

	// 🔹 Ubah map ke slice
	// 🔹 Ubah map ke slice
	var result []model.RWData
	for _, v := range grouped {
		result = append(result, *v)
	}

	// 🔹 Urutkan berdasarkan RW (ascending)
	sort.Slice(result, func(i, j int) bool {
		return result[i].RW < result[j].RW
	})

	c.JSON(http.StatusOK, gin.H{
		"data":    result,
		"total":   totalKeseluruhan,
		"tanggal": input.Tanggal,
	})

}

// Helper: ambil key dari map[int]int
func arrayKeys(m map[int]int) []int {
	keys := make([]int, 0, len(m))
	for k := range m {
		keys = append(keys, k)
	}
	return keys
}

// Helper: inisialisasi struktur jenis_tatanan kosong
func initJenisTatanan() map[string]map[string]int {
	return map[string]map[string]int{
		"rumah_tangga":    {"dikunjungi": 0, "positif": 0},
		"perkantoran":     {"dikunjungi": 0, "positif": 0},
		"inst_pendidikan": {"dikunjungi": 0, "positif": 0},
		"ttu":             {"dikunjungi": 0, "positif": 0},
		"fas_olahraga":    {"dikunjungi": 0, "positif": 0},
		"tpm":             {"dikunjungi": 0, "positif": 0},
		"fas_kesehatan":   {"dikunjungi": 0, "positif": 0},
	}
}
