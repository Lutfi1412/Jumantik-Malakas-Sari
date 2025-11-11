package laporan

import (
	"context"
	"net/http"

	"api-jumantik/config"

	"github.com/gin-gonic/gin"
)

func GetRT(c *gin.Context) {
	role := c.GetString("role")
	userHashingID := c.GetString("id")
	var rt int
	var err error

	if role != "koordinator" && role != "petugas" {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Tidak diizinkan. Hanya koordinator atau petugas yang dapat mengakses data RT."})
		return
	}

	err = config.Pool.QueryRow(context.Background(),
		`SELECT rt FROM users WHERE hashing_id = $1`, userHashingID,
	).Scan(&rt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Gagal mengambil data RT pengguna"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"rt": rt,
	})
}
