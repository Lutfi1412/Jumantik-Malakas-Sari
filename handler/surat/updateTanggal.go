package surat

import (
	"context"
	"net/http"

	"api-jumantik/config"
	"api-jumantik/model"

	"github.com/gin-gonic/gin"
)

func UpdateTanggal(c *gin.Context) {
	ID := c.Param("id")
	role := c.GetString("role")

	if role == "warga" {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Akses ditolak, hanya koordinator atau admin yang dapat memperbarui tanggal."})
		return
	}

	var input model.CreateTanggal
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Format data tidak valid, pastikan data yang dikirim sudah benar."})
		return
	}

	// 🔹 Ambil RW dari record yang mau diupdate
	var currentRW int
	err := config.Pool.QueryRow(context.Background(),
		`SELECT rw FROM tanggal WHERE id = $1`, ID,
	).Scan(&currentRW)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Data tanggal tidak ditemukan."})
		return
	}

	// 🔹 Cek apakah sudah ada tanggal & rw yang sama di record lain
	var exists bool
	err = config.Pool.QueryRow(context.Background(),
		`SELECT EXISTS (
			SELECT 1 FROM tanggal 
			WHERE tanggal = $1 AND rw = $2
		)`, input.Tanggal, currentRW,
	).Scan(&exists)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Terjadi kesalahan saat memeriksa data tanggal: " + err.Error()})
		return
	}

	if exists {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Tanggal dengan RW tersebut sudah terdaftar, silakan gunakan tanggal lain."})
		return
	}

	// 🔹 Lanjut update jika tidak duplikat
	queryUpdate := `
		UPDATE tanggal 
		SET tanggal = $1 
		WHERE id = $2
	`
	result, err := config.Pool.Exec(context.Background(), queryUpdate, input.Tanggal, ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Gagal memperbarui data tanggal: " + err.Error()})
		return
	}

	if result.RowsAffected() == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "Tidak ada data tanggal yang diperbarui."})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Data tanggal berhasil diperbarui.",
	})
}
