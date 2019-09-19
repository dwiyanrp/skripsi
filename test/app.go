package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"
)

var (
	client = &http.Client{}
	HOST   = "http://165.22.98.110:8080"

	MANAGER_ADDRESS = "0x15C8CF5497e4E943A521EDCF72f3818eba728EcB"
	GRANT_ADDRESS   = "0x5F5dCAb24b827EA22f7c203D06316AFb892f8fA7"

	req_AddDevice = make([]*ADD_DEVICE, 0)
	req_AddRule   = make([]*ADD_RULE, 0)
	req_CheckRule = make([]*CHECK_RULE, 0)
	DEBUG         = true

	ARR = []string{
		":01", ":02", ":03", ":04", ":05", ":06", ":07", ":08", ":09", ":10",
		":11", ":12", ":13", ":14", ":15", ":16", ":17", ":18", ":19", ":20",
		":21", ":22", ":23", ":24", ":25", ":26", ":27", ":28", ":29", ":30",
		":31", ":32", ":33", ":34", ":35", ":36", ":37", ":38", ":39", ":40",
		":41", ":42", ":43", ":44", ":45", ":46", ":47", ":48", ":49", ":50",
	}
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

type CHECK_RULE struct {
	DeviceID string
	AuthUser string
	Req      *http.Request
}

func main() {
	log.Println("Running experiment 1")
	Init_AddDevice(":01")
	Run_AddDevice()
	Run_AddRule()
	Run_CheckRule()

	log.Println("Running experiment 2")
	Init_AddDevice(":02")
	Run_AddDevice()
	Run_AddRule()
	Run_CheckRule()

	log.Println("Running experiment 3")
	Init_AddDevice(":03")
	Run_AddDevice()
	Run_AddRule()
	Run_CheckRule()
}

func Init_AddDevice(currCount string) {
	req_AddDevice = make([]*ADD_DEVICE, 0)
	req_AddRule = make([]*ADD_RULE, 0)
	req_CheckRule = make([]*CHECK_RULE, 0)

	for _, a := range ARR {
		deviceID := "B3:69:D0:E1" + currCount + a

		// Init Req ADD DEVICE
		requestBody, _ := json.Marshal(map[string]string{"device_id": deviceID, "device_type": "1"})
		req, _ := http.NewRequest("POST", HOST+"/device", bytes.NewBuffer(requestBody))
		req.Header.Set("Authorization", MANAGER_ADDRESS)
		req.Header.Set("Content-Type", "application/json")
		req_AddDevice = append(req_AddDevice, &ADD_DEVICE{deviceID, "1", req})

		// Init Req ADD RULE
		requestBody, _ = json.Marshal(map[string]string{"device_id": deviceID, "user_address": GRANT_ADDRESS})
		req, _ = http.NewRequest("POST", HOST+"/rule", bytes.NewBuffer(requestBody))
		req.Header.Set("Authorization", MANAGER_ADDRESS)
		req.Header.Set("Content-Type", "application/json")
		req_AddRule = append(req_AddRule, &ADD_RULE{deviceID, GRANT_ADDRESS, req})

		req, _ = http.NewRequest("GET", HOST+"/rule?device_id="+deviceID, nil)
		req.Header.Set("Authorization", GRANT_ADDRESS)
		req_CheckRule = append(req_CheckRule, &CHECK_RULE{deviceID, GRANT_ADDRESS, req})
	}
}

func Run_AddDevice() {
	start := time.Now()
	for i, ad := range req_AddDevice {
		if i%5 == 0 {
			fmt.Println(ad.DeviceID)
		}

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
	for i, ar := range req_AddRule {
		if i%5 == 0 {
			fmt.Println(ar.DeviceID, ar.GrantUser)
		}

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

func Run_CheckRule() {
	start := time.Now()
	for i, cr := range req_CheckRule {
		if i%5 == 0 {
			fmt.Println(cr.DeviceID, cr.AuthUser)
		}

		resp, err := client.Do(cr.Req)
		if err != nil {
			fmt.Println(err)
		} else {
			body, _ := ioutil.ReadAll(resp.Body)
			if resp.StatusCode != 200 {
				fmt.Println(string(body))
			} else if DEBUG {
				fmt.Println(string(body))
			}
		}
		resp.Body.Close()
	}
	fmt.Println(time.Now().Sub(start))
}
