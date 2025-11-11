package surat

import (
	"api-jumantik/config"
	"api-jumantik/model"
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
)

func DeleteSurat(c *gin.Context) {
	role := c.GetString("role")

	// hanya admin dan koordinator yang boleh hapus
	if role != "admin" && role != "koordinator" {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Tidak diizinkan. Hanya admin atau koordinator yang dapat menghapus surat."})
		return
	}

	// ambil array id dari body: { "ids": [1,2,3] }
	var input model.DeleteTanggal

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Format data tidak valid"})
		return
	}

	if len(input.IDs) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Daftar ID surat tidak boleh kosong"})
		return
	}

	// hapus semua surat dengan id yang dikirim
	query := `DELETE FROM surat WHERE id = ANY($1)`
	result, err := config.Pool.Exec(context.Background(), query, input.IDs)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Terjadi kesalahan saat menghapus surat"})
		return
	}

	rows := result.RowsAffected()
	if rows == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "Tidak ditemukan surat yang sesuai untuk dihapus"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Surat berhasil dihapus",
	})
}
