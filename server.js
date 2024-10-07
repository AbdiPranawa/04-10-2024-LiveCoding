const fs = require("fs");
const express = require("express");

const app = express();

// middleware untuk membaca json dari request body
app.use(express.json());
// default URL = Health check

app.get("/", (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "Application is running oyy",
    data: [],
  });
});

// if(req url === "abdi") {}
// get digunakan untuk menuju url yang sesuai dengan /
app.get("/abdi", (req, res) => {
  res.status(200).json({
    message: "ping successfully !",
  });
});

const cars = JSON.parse(fs.readFileSync(`${__dirname}/data/cars.json`, "utf-8"));

// api/v1(collectionnya) => collectionnya harus jamak (s)
app.get("/api/v1/cars", (req, res) => {
  // respon hanya menampilkan hasil tidak boleh ada proses (JSON.parse)
  res.status(200).json({
    status: "success",
    message: "success get cars data",
    isSuccess: true,
    totalData: cars.length,
    data: {
      cars,
    },
  });
});

app.post("/api/v1/cars", (req, res) => {
  // insert into ...

  const newCar = req.body;

  cars.push(newCar);

  fs.writeFile(`${__dirname}/data/cars.json`, JSON.stringify(cars), (err) => {
    // respon hanya menampilkan hasil tidak boleh ada proses (JSON.parse)
    res.status(200).json({
      status: "success",
      message: "success get cars data",
      isSuccess: true,
      data: {
        car: newCar,
      },
    });
  });
});

// get cars by id
app.get("/api/v1/cars/:id", (req, res) => {
  // select * from fsw2 where id="1" OR NAME = "Abdi"
  const id = parseInt(req.params.id);
  console.log(typeof id);
  const car = cars.find((i) => i?.id == id);
  console.log(car);

  if (!car) {
    console.log("gaada data");
    return res.status(404).json({
      status: "Failed",
      message: `Failed get car data this ${id}`,
      isSuccess: false,
      data: null,
    });
  }

  res.status(200).json({
    status: "success",
    message: "success get cars data",
    isSuccess: true,
    data: {
      car,
    },
  });
});

app.patch("/api/v1/cars/:id", (req, res) => {
  const id = parseInt(req.params.id);
  // UPDATE ........ from (table) where id=req.params.id

  // object destructuring
  const { name, year, type } = req.body;

  // mencari data by id
  const car = cars.find((i) => i?.id == id);
  // error handling jika cars tidak ditemukan
  if (!car) {
    console.log("gaada data");
    return res.status(404).json({
      status: "Failed",
      message: `Failed get car data this ${id}`,
      isSuccess: false,
      data: null,
    });
  }
  // mencari indexnya
  const carIndex = cars.findIndex((car) => car.id == id);
  console.log(carIndex);

  console.log(cars);
  // update sesuai req body
  // object assign = menggunakan objek spread operator
  cars[carIndex] = { ...cars[carIndex], ...req.body };

  // masukkan / rewrite data json dalam file

  fs.writeFile(`${__dirname}/data/cars.json`, JSON.stringify(cars), (err) => {
    // respon hanya menampilkan hasil tidak boleh ada proses (JSON.parse)
    res.status(201).json({
      status: "success",
      message: "success update cars data",
      isSuccess: true,
    });
  });
});

app.delete("/api/v1/cars/:id", (req, res) => {
  const id = parseInt(req.params.id);
  // delete ........ from (table) where id=req.params.id

  // object destructuring
  const { name, year, type } = req.body;

  // mencari data by id
  const car = cars.find((i) => i?.id == id);
  // error handling jika cars tidak ditemukan
  if (!car) {
    console.log("gaada data");
    return res.status(404).json({
      status: "Failed",
      message: `Failed get car data this ${id}`,
      isSuccess: false,
      data: null,
    });
  }

  // mencari indexnya
  const carIndex = cars.findIndex((car) => car.id == id);
  console.log(carIndex);

  //  delete berdasarkan id
  cars.splice(carIndex, 1);

  // masukkan / rewrite data json dalam file
  fs.writeFile(`${__dirname}/data/cars.json`, JSON.stringify(cars), (err) => {
    // respon hanya menampilkan hasil tidak boleh ada proses (JSON.parse)
    res.status(201).json({
      status: "success",
      message: "success delete cars data",
      isSuccess: true,
    });
  });
});

// middleware untuk url yang tidak ada di aplikasi
// use digunakan untuk membuat middleware sendiri
app.use((req, res, next) => {
  res.status(404).json({
    status: "Failed",
    message: "URL not exist!",
  });
});

app.listen("3000", () => {
  console.log("start aplikasi kita di port 3000");
});
