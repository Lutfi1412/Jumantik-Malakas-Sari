package laporan

import (
	"context"
	"net/http"

	"api-jumantik/config"

	"github.com/gin-gonic/gin"
)

func GetGambar(c *gin.Context) {
	role := c.GetString("role")
	var Gambar string
	var err error

	ID := c.Param("id")

	if role != "koordinator" && role != "admin" {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Tidak diizinkan. Hanya admin atau koordinator yang dapat mengakses gambar laporan."})
		return
	}

	err = config.Pool.QueryRow(context.Background(),
		`SELECT gambar FROM laporan WHERE id = $1`, ID,
	).Scan(&Gambar)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Gagal mengambil gambar"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"gambar": Gambar,
	})
}
