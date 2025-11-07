package surat

import (
	"context"
	"net/http"

	"api-jumantik/config"
	"api-jumantik/model"

	"github.com/gin-gonic/gin"
)

func GetTanggal(c *gin.Context) {
	role := c.GetString("role")
	userHashingID := c.GetString("id")

	// 🔐 Validasi role
	if role != "koordinator" && role != "admin" {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	// 🔹 Ambil RW berdasarkan hashing_id user
	var rw int
	err := config.Pool.QueryRow(
		context.Background(),
		`SELECT rw FROM users WHERE hashing_id = $1`,
		userHashingID,
	).Scan(&rw)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Gagal ambil RW: " + err.Error()})
		return
	}

	// 🔹 Query data tanggal
	rows, err := config.Pool.Query(
		context.Background(),
		`SELECT id, tanggal FROM tanggal WHERE rw = $1 ORDER BY tanggal DESC`,
		rw,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Gagal ambil tanggal: " + err.Error()})
		return
	}
	defer rows.Close()

	// 🔹 Masukkan hasil ke slice struct
	var tanggalList []model.TanggalData
	for rows.Next() {
		var t model.TanggalData
		if err := rows.Scan(&t.ID, &t.Tanggal); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Gagal baca data tanggal: " + err.Error()})
			return
		}
		tanggalList = append(tanggalList, t)
	}

	// 🔹 Response JSON
	c.JSON(http.StatusOK, gin.H{
		"data":    tanggalList,
		"message": "Data tanggal berhasil diambil",
	})
}
