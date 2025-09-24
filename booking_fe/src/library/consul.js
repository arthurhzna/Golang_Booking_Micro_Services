require('dotenv').config();
const Consul = require('consul');
const fs = require('fs');
const path = require("node:path");

const splitUrl = process.env.CONSUL_HTTP_URL.split(':');
const consul = new Consul({
  host: splitUrl[0],
  port: splitUrl[1],
  defaults: {
    token: process.env.CONSUL_HTTP_TOKEN,
  },
});

async function fetchConsulData() {
  try {
    const consulPath = process.env.CONSUL_HTTP_PATH
    const kvPairs = await consul.kv.get({ key: consulPath, recurse: true });

    if (!kvPairs || !Array.isArray(kvPairs)) {
      console.error('No data found in Consul KV.');
      return;
    }

    const envData = kvPairs
      .map((kv) => {
        console.log(kv.Key)
        return kv.Value ? kv.Value.toString() : '';
      })
      .join('\n');

    const envPath = path.resolve(process.cwd(), '.env');
    fs.writeFileSync(envPath, envData);

    console.log('.env file has been generated successfully!');
  } catch (error) {
    console.error('Error fetching data from Consul:', error);
  }
}

fetchConsulData();
