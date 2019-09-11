package main

import (
	"bytes"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"
)

var (
	client          = &http.Client{}
	MANAGER_ADDRESS = "0x8685bb0e4756e31877acc6555c53cd38973a3123"
	req_AddDevice   = make([]*ADD_DEVICE, 0)
	req_AddRule     = make([]*ADD_RULE, 0)
	DEBUG           = true
)

type ADD_DEVICE struct {
	DeviceID   string
	DeviceType string
	Req        *http.Request
}

type ADD_RULE struct {
	DeviceID  string
	GrantUser string
	Req       *http.Request
}

func main() {
	log.Println("Running experiment 1")
	Init_AddDevice("add_device.csv")
	Run_AddDevice()
	Init_AddRule("add_rule.csv")
	Run_AddRule()

	log.Println("Running experiment 2")
	Init_AddDevice("add_device2.csv")
	Run_AddDevice()
	Init_AddRule("add_rule2.csv")
	Run_AddRule()

	log.Println("Running experiment 3")
	Init_AddDevice("add_device3.csv")
	Run_AddDevice()
	Init_AddRule("add_rule3.csv")
	Run_AddRule()
}

func Init_AddDevice(filename string) {
	csvfile, err := os.Open(filename)
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

func Init_AddRule(filename string) {
	csvfile, err := os.Open(filename)
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
		fmt.Println(ad.DeviceID)
		resp, err := client.Do(ad.Req)
		if err != nil {
			fmt.Println(err)
		} else {
			body, _ := ioutil.ReadAll(resp.Body)
			if resp.StatusCode != 200 {
				fmt.Println(string(body))
			} else if DEBUG {
				// fmt.Println(string(body))
			}
		}
		resp.Body.Close()
	}
	fmt.Println(time.Now().Sub(start))
}

func Run_AddRule() {
	start := time.Now()
	for _, ar := range req_AddRule {
		fmt.Println(ar.DeviceID, ar.GrantUser)
		resp, err := client.Do(ar.Req)
		if err != nil {
			fmt.Println(err)
		} else {
			body, _ := ioutil.ReadAll(resp.Body)
			if resp.StatusCode != 200 {
				fmt.Println(string(body))
			} else if DEBUG {
				// fmt.Println(string(body))
			}
		}
		resp.Body.Close()
	}
	fmt.Println(time.Now().Sub(start))
}
