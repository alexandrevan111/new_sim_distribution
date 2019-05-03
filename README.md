# ABI
- solcjs --abi flattened.sol

# BIN ( ByteCode )
- solcjs --bin flattened.sol

# Smart Contract Deployment
- Using deploy.js

# Network (Dev)
- geth --dev --datadir ./devnet console

# Network (Ropsten)
- geth --testnet --fast --bootnodes "enode://20c9ad97c081d63397d7b685a412227a40e23c8bdc6688c6f37e97cfbc22d2b4d1db1510d8f61e6a8866ad7f0e17c02b14182d37ea7c3c8b9c2683aeb6b733a1@52.169.14.227:30303,enode://6ce05930c72abc632c58e2e4324f7c7ea478cec0ed4fa2528982cf34483094e9cbc9216e7aa349691242576d552a2a56aaeae426c5303ded677ce455ba1acd9d@13.84.180.240:30303"

# Network (Live)
- geth --syncmode "fast" --cache=1024 console
- geth --fast -cache=1024 console

# Run Network As a Service
- Go to /lib/systemd/system and make new file named geth.service
- Put this content
  * [Unit] *
  * Description = Live Ethereum Network *
  * Documentation=man:geth(1) *
  * After=network.target *
  * *
  * [Service] *
  * User=ubuntu *
  * Group=ubuntu *
  * Execstart=/usr/bin/geth --fast 2>/home/ubuntu/geth.log *
  * *
  * [Install] *
  * WantedBy=default.target *
 - Enable service: sudo systemctl enable geth.service
 - Start service: sudo systemctl start geth.service