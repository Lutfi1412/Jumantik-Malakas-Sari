package surat

import (
	"context"
	"net/http"

	"api-jumantik/config"
	"api-jumantik/model"

	"github.com/gin-gonic/gin"
)

func CreateTanggal(c *gin.Context) {
	userHashingID := c.GetString("id")
	role := c.GetString("role")

	if role != "admin" && role != "koordinator" {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	// 🔹 Ambil RW dari user
	var rw int
	err := config.Pool.QueryRow(
		context.Background(),
		"SELECT rw FROM users WHERE hashing_id=$1",
		userHashingID,
	).Scan(&rw)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "User tidak ditemukan"})
		return
	}

	var input model.CreateTanggal
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	// 🔹 Cek apakah tanggal dan RW sudah ada
	var exists bool
	checkQuery := `
        SELECT EXISTS (
            SELECT 1 FROM tanggal WHERE tanggal = $1 AND rw = $2
        )
    `
	err = config.Pool.QueryRow(context.Background(), checkQuery, input.Tanggal, rw).Scan(&exists)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Gagal cek data: " + err.Error()})
		return
	}
	if exists {
		c.JSON(http.StatusConflict, gin.H{"message": "Tanggal ini sudah ada untuk RW tersebut"})
		return
	}

	// 🔹 Jika belum ada, lanjut insert
	query := `
        INSERT INTO tanggal (tanggal, rw)
        VALUES ($1, $2)
    `
	_, err = config.Pool.Exec(context.Background(), query, input.Tanggal, rw)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Tanggal berhasil ditambahkan"})
}
