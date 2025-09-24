VM
- app-server (all service + kafka)
- consul-server
- jenkins-server

Firewall 
0.0.0.0/0
tcp:3000, 8000, 8001, 8002, 8003, 8004, 8070, 8080, 8500, 9092, 19092, 29092, 29093

cloud sql 
PostgreSQL 17


-----------------------------------------------

Install Jenkins
sudo apt update
sudo apt install fontconfig openjdk-17-jre -y
java -version
sudo wget -O /usr/share/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc]" \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt-get update
sudo apt-get install jenkins -y


check password from
cat var/lib/jenkins/secrets/initialAdminPassword
open port 8080

set your account .......

install plugins
blue ocean
docker
go
ssh agent

set:
Credentials
System	(global)	docker-credential	arthurhozanna/******
Username with password	Jenkins Credentials Provider	System	(global)	github-credential	arthurhzna/******
Secret text	Jenkins Credentials Provider	System	(global)	consul-http-url	consul-http-url
Secret text	Jenkins Credentials Provider	System	(global)	consul-http-token	consul-http-token
Secret text	Jenkins Credentials Provider	System	(global)	username	username
Secret text	Jenkins Credentials Provider	System	(global)	host	host
SSH Username with private key	Jenkins Credentials Provider	System	(global)	ssh-key	arthurhozana123

host from app vm
ssh key from jenkins and regist it to app vm 


add github 
GitHub project
Project url
GitHub hook trigger for GITScm polling
definition pipeline script from scm -> git -> repository url --> credentials (your github user) --> choose branch 

field_service
	14 hr #5	1 day 21 hr #2	12 min	
mini-soccer-fe
	19 min #7	45 min #5	3 min 43 sec	
order_service
	14 hr #9	1 day 10 hr #2	5 min 44 sec	
payment_service
	14 hr #10	1 day 10 hr #6	9 min 27 sec	
user-service
	14 hr #42	1 day 23 hr #37	12 min	

every repository regist webhook to triger commit 
yourip/8080/github-webhook   ---> send me everything
Developer push code -> GitHub -> webhook -> Jenkins job build/test/deploy


Install Consul KV
sudo apt update && sudo apt upgrade -y
sudo apt install -y unzip curl
curl -O https://releases.hashicorp.com/consul/1.16.0/consul_1.16.0_linux_amd64.zip
unzip consul_1.16.0_linux_amd64.zip
sudo mv consul /usr/bin/
consul --version
sudo mkdir -p /etc/consul.d /opt/consul
sudo chmod -R 775 /etc/consul.d /opt/consul


sudo nano /etc/consul.d/consul.hcl

data_dir = "/opt/consul"
log_level = "INFO"
server = true
bootstrap_expect = 1
bind_addr = "0.0.0.0"
client_addr = "0.0.0.0"
ui = true
acl {
  enabled = true
  default_policy = "deny"
  enable_token_persistence = true
  tokens {
    master = "isi dengan token sendiri biasanya menggunakan uuid"
  }
}

sudo nano /etc/systemd/system/consul.service

[Unit]
Description=HashiCorp Consul - A service mesh solution
Documentation=https://www.consul.io/
Requires=network-online.target
After=network-online.target

[Service]
User=root
Group=root
ExecStart=/usr/bin/consul agent -config-dir=/etc/consul.d/
ExecReload=/bin/kill -HUP $MAINPID
KillMode=process
Restart=on-failure
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target

sudo systemctl daemon-reload
sudo systemctl enable consul
sudo systemctl start consul
sudo systemctl status consul

access :8500 to login with token 
  tokens {
    master = "isi dengan token sendiri biasanya menggunakan uuid"
  }

add key value each service from config.json



app vm 
sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt-cache policy docker-ce

sudo apt install docker-ce
sudo systemctl status docker

sudo usermod -aG docker ${USER}
sudo su - ${USER}
groups

sudo apt install docker-compose


domain setup

login to your domain web, regisrt your ip app vm to dns domain

and in app vm side 

cd /etc/nginx/sites-available

arthurhozana123@app-server:/etc/nginx/sites-available$ ls
default  field.hozanna.site  order.hozanna.site  payment.hozanna.site  user.hozanna.site

sudo ln  -s /etc/nginx/sites-available/booking-fe.hozanna.site /etc/nginx/sites-enabled
arthurhozana123@app-server:/etc/nginx/sites-available$ cat booking-fe.hozanna.site
server {
  listen 80;
  listen [::]:80;
  server_name booking-fe.hozanna.site;

  location / {
      proxy_pass http://localhost:3000/;
  }
}

arthurhozana123@app-server:/etc/nginx/sites-available$ sudo certbot --nginx
Saving debug log to /var/log/letsencrypt/letsencrypt.log

Which names would you like to activate HTTPS for?
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1: booking-fe.hozanna.site
2: field.hozanna.site
3: order.hozanna.site
4: payment.hozanna.site
5: user.hozanna.site
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Select the appropriate numbers separated by commas and/or spaces, or leave input
blank to select all options shown (Enter 'c' to cancel): 1
Requesting a certificate for booking-fe.hozanna.site

Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/booking-fe.hozanna.site/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/booking-fe.hozanna.site/privkey.pem
This certificate expires on 2025-12-23.
These files will be updated when the certificate renews.
Certbot has set up a scheduled task to automatically renew this certificate in the background.

Deploying certificate
Successfully deployed certificate for booking-fe.hozanna.site to /etc/nginx/sites-enabled/booking-fe.hozanna.site
Congratulations! You have successfully enabled HTTPS on https://booking-fe.hozanna.site

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
If you like Certbot, please consider supporting our work by:
 * Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
 * Donating to EFF:                    https://eff.org/donate-le
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
arthurhozana123@app-server:/etc/nginx/sites-available$

in midtrans dont forget to add your endpoint webhook from payment

forward each port 
lastly regist topic kafka in port 8070
done




