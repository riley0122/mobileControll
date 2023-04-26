#!/bin/bash

# Check if Git is installed
if ! [ -x "$(command -v git)" ]; then
  echo "Error: Git is not installed. Please install Git and try again." >&2
  exit 1
fi

# Check if npm is installed
if ! [ -x "$(command -v npm)" ]; then
  echo "Error: npm is not installed. Please install npm and try again." >&2
  exit 1
fi

# Download the repository
git clone https://github.com/lucasammer/mobileControll.git

# Install dependencies in the src/srv folder
cd mobileControll/src/srv
npm install

# Create a service file
cat > /etc/systemd/system/mobile-control.service <<EOF
[Unit]
Description=Mobile Control service
After=network.target

[Service]
User=$(whoami)
WorkingDirectory=$(pwd)
ExecStart=/bin/bash $(pwd)/run.sh

[Install]
WantedBy=multi-user.target
EOF

# Reload the systemd daemon
sudo systemctl daemon-reload

# Start the service and enable it to start on system startup
sudo systemctl start mobile-control
sudo systemctl enable mobile-control


