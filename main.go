package main

import (
	"api-jumantik/config"
	"api-jumantik/handler"
	"api-jumantik/middleware"

	"api-jumantik/handler/konten"
	"api-jumantik/handler/laporan"
	"api-jumantik/handler/surat"
	"api-jumantik/handler/user"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	config.Init()
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: false,
	}))

	// login tanpa middleware
	r.POST("/login", user.LoginUser)
	r.POST("/check-token", handler.CheckToken)

	// grup autentikasi
	authGroup := r.Group("/auth")
	authGroup.Use(middleware.Auth())
	{
		// --- USER ---
		authGroup.POST("/create-user", user.CreateUser)
		authGroup.PUT("/update-user/:id", user.UpdateUser)
		authGroup.GET("/get-user", user.GetUser)
		authGroup.DELETE("/delete-user/:id", user.DeleteUser)

		// --- LAPORAN ---
		authGroup.POST("/create-laporan", laporan.CreateLaporan)
		authGroup.GET("/laporan", laporan.GetLaporan)
		authGroup.PUT("/update-laporan/:id", laporan.UpdateLaporan)
		authGroup.DELETE("/delete-laporan", laporan.DeleteLaporan)
		authGroup.GET("/get-rt", laporan.GetRT)
		authGroup.GET("/get-gambar/:id", laporan.GetGambar)

		// --- KONTEN ---
		authGroup.POST("/create-konten", konten.CreateKonten)
		authGroup.GET("/get-konten", konten.GetKonten)
		authGroup.PUT("/update-konten/:id", konten.UpdateKonten)
		authGroup.DELETE("/delete-konten/:id", konten.DeleteKonten)

		// --- SURAT---
		authGroup.POST("/create-surat", surat.CreateSurat)
		authGroup.PUT("/update-surat/:id", surat.UpdateSurat)
		authGroup.DELETE("/delete-surat", surat.DeleteSurat)
		authGroup.GET("/get-surat-rw", surat.GetSuratRW)
		authGroup.GET("/get-surat-admin", surat.GetSuratAdmin)
		authGroup.POST("/get-rw", surat.GetRW)

		//tanggal
		authGroup.POST("/create-tanggal", surat.CreateTanggal)
		authGroup.DELETE("/delete-tanggal", surat.DeleteTanggal)
		authGroup.PUT("/update-tanggal/:id", surat.UpdateTanggal)
		authGroup.GET("/get-tanggal", surat.GetTanggal)
	}

	r.Run("0.0.0.0:8080")
}

// package main

// import (
// 	"fmt"
// 	"time"

// 	"github.com/golang-jwt/jwt/v5"
// )

// func main() {
// 	// Secret key langsung ditulis manual
// 	var jwtKey = []byte("KorbanMBG")

// 	// Buat payload (claims)
// 	claims := jwt.MapClaims{
// 		"id":   1,                                    // ID user
// 		"role": "admin",                              // Role user
// 		"exp":  time.Now().Add(1 * time.Hour).Unix(), // Expired 1 jam
// 	}

// 	// Buat token
// 	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

// 	// Tanda tangani token dengan secret key
// 	tokenString, err := token.SignedString(jwtKey)
// 	if err != nil {
// 		fmt.Println("Gagal membuat token:", err)
// 		return
// 	}

// 	fmt.Println("Token JWT berhasil dibuat:")
// 	fmt.Println(tokenString)
// }
