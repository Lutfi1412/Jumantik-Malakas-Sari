package surat

import (
	"context"
	"net/http"

	"api-jumantik/config"

	"github.com/gin-gonic/gin"
)

func GetTanggal(c *gin.Context) {
	role := c.GetString("role")
	userHashingID := c.GetString("id")

	// Hanya role tertentu yang boleh
	if role != "koordinator" && role != "admin" {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	// 🔹 Ambil rw berdasarkan hashing_id user
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

	rows, err := config.Pool.Query(
		context.Background(),
		`SELECT tanggal FROM tanggal WHERE rw = $1 ORDER BY tanggal DESC`,
		rw,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Gagal ambil tanggal: " + err.Error()})
		return
	}
	defer rows.Close()

	// 🔹 Kumpulkan hasil query ke slice
	var tanggalList []string
	for rows.Next() {
		var t string
		if err := rows.Scan(&t); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Gagal baca data tanggal: " + err.Error()})
			return
		}
		tanggalList = append(tanggalList, t)
	}

	c.JSON(http.StatusOK, gin.H{
		"tanggal": tanggalList,
		"message": "Data tanggal berhasil diambil",
	})
}
