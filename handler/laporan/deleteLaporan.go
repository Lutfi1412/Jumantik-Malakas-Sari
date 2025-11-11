package laporan

import (
	"api-jumantik/config"
	"api-jumantik/model"
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
)

func DeleteLaporan(c *gin.Context) {
	role := c.GetString("role")

	// hanya admin dan koordinator yang boleh hapus
	if role != "admin" && role != "koordinator" {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Tidak diizinkan. Hanya admin atau koordinator yang dapat menghapus laporan."})
		return
	}

	// ambil array id dari body: { "ids": [1,2,3] }
	var input model.DeleteLaporan

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Format data tidak valid"})
		return
	}

	if len(input.IDs) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Daftar ID laporan tidak boleh kosong"})
		return
	}

	// hapus semua laporan dengan id yang dikirim
	query := `DELETE FROM laporan WHERE id = ANY($1)`
	result, err := config.Pool.Exec(context.Background(), query, input.IDs)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Terjadi kesalahan saat menghapus laporan"})
		return
	}

	rows := result.RowsAffected()
	if rows == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "Tidak ditemukan laporan yang sesuai untuk dihapus"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":      "Laporan berhasil dihapus",
		"rows_deleted": rows,
	})
}
