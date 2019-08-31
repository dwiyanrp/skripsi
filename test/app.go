package main

import (
	"bytes"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"
)

type ADD_DEVICE struct {
	DeviceID   string
	DeviceType string
	Req        *http.Request
}

func (ad *ADD_DEVICE) PrintSuccess() {
	fmt.Println(ad.DeviceID + " | " + ad.DeviceType + " | success added")
}

type ADD_RULE struct {
	DeviceID  string
	GrantUser string
	Req       *http.Request
}

func (ar *ADD_RULE) PrintSuccess() {
	fmt.Println(ar.DeviceID + " | " + ar.GrantUser + " | success added")
}

var (
	client          = &http.Client{}
	MANAGER_ADDRESS = "0xCfD53011913d3b43559E989677923189265bDb1e"
	req_AddDevice   = make([]*ADD_DEVICE, 0)
	req_AddRule     = make([]*ADD_RULE, 0)
	DEBUG           = true
)

func main() {
	Init_AddDevice()
	Run_AddDevice()

	Init_AddRule()
	Run_AddRule()
}

func Init_AddDevice() {
	csvfile, err := os.Open("add_device.csv")
	if err != nil {
		log.Fatalln("Couldn't open the csv file", err)
	}

	r := csv.NewReader(csvfile)
	isFirst := true
	for {
		record, err := r.Read()
		if err == io.EOF {
			break
		} else if err != nil {
			log.Fatal(err)
		} else if isFirst {
			isFirst = false
			continue
		}

		requestBody, _ := json.Marshal(map[string]string{"device_id": record[0], "device_type": record[1]})
		req, err := http.NewRequest("POST", "http://localhost:8080/device", bytes.NewBuffer(requestBody))
		req.Header.Set("Authorization", MANAGER_ADDRESS)
		req.Header.Set("Content-Type", "application/json")

		req_AddDevice = append(req_AddDevice, &ADD_DEVICE{record[0], record[1], req})
	}
}

func Init_AddRule() {
	csvfile, err := os.Open("add_rule.csv")
	if err != nil {
		log.Fatalln("Couldn't open the csv file", err)
	}

	r := csv.NewReader(csvfile)
	isFirst := true
	for {
		record, err := r.Read()
		if err == io.EOF {
			break
		} else if err != nil {
			log.Fatal(err)
		} else if isFirst {
			isFirst = false
			continue
		}

		requestBody, _ := json.Marshal(map[string]string{"device_id": record[0], "user_address": record[1]})
		req, err := http.NewRequest("POST", "http://localhost:8080/rule", bytes.NewBuffer(requestBody))
		req.Header.Set("Authorization", MANAGER_ADDRESS)
		req.Header.Set("Content-Type", "application/json")

		req_AddRule = append(req_AddRule, &ADD_RULE{record[0], record[1], req})
	}
}

func Run_AddDevice() {
	start := time.Now()
	for _, ad := range req_AddDevice {
		_, err := client.Do(ad.Req)
		if err != nil {
			fmt.Println(err)
		} else {
			if DEBUG {
				ad.PrintSuccess()
			}
		}
	}
	fmt.Println(time.Now().Sub(start))
}

func Run_AddRule() {
	start := time.Now()
	for _, ar := range req_AddRule {
		_, err := client.Do(ar.Req)
		if err != nil {
			fmt.Println(err)
		} else {
			if DEBUG {
				ar.PrintSuccess()
			}
		}
	}
	fmt.Println(time.Now().Sub(start))
}
