package surat

import (
	"context"
	"net/http"

	"api-jumantik/config"
	"api-jumantik/model"

	"github.com/gin-gonic/gin"
)

func GetRW(c *gin.Context) {
	role := c.GetString("role")
	var err error

	if role != "admin" {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	var input model.GetSuratAdminRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid payload"})
		return
	}

	rows, err := config.Pool.Query(
		context.Background(),
		`SELECT id, rw FROM tanggal WHERE tanggal = $1 ORDER BY rw ASC`,
		input.Tanggal,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Gagal ambil tanggal: " + err.Error()})
		return
	}
	defer rows.Close()

	var tanggalList []model.GetRW
	for rows.Next() {
		var t model.GetRW
		if err := rows.Scan(&t.ID, &t.RW); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Gagal baca data tanggal: " + err.Error()})
			return
		}
		if t.RW == 0 {
			continue // ⛔ lewati data rw = 0
		}
		tanggalList = append(tanggalList, t)
	}

	// 🔹 Response JSON
	c.JSON(http.StatusOK, gin.H{
		"data":    tanggalList,
		"message": "Data tanggal berhasil diambil",
	})
}
