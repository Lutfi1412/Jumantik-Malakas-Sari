package user

import (
	"context"
	"net/http"

	"api-jumantik/config"

	"github.com/gin-gonic/gin"
)

func DeleteUser(c *gin.Context) {
	hashingID := c.Param("id")
	hashingID = `\` + hashingID

	if hashingID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "ID pengguna (hashing_id) tidak ditemukan"})
		return
	}

	role := c.GetString("role")
	if role != "admin" {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Akses ditolak, hanya admin yang dapat menghapus pengguna"})
		return
	}

	// Jalankan query delete
	query := `DELETE FROM users WHERE hashing_id = $1`
	result, err := config.Pool.Exec(context.Background(), query, hashingID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Terjadi kesalahan saat menghapus pengguna"})
		return
	}

	if result.RowsAffected() == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "Pengguna tidak ditemukan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Pengguna berhasil dihapus"})
}
