const dns = require('dns').promises;

async function run() {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
    console.log("Resolving SRV records for _mongodb._tcp.cluster0.l7xeac9.mongodb.net...");
    const srv = await dns.resolveSrv('_mongodb._tcp.cluster0.l7xeac9.mongodb.net');
    console.log('SRV Records:', JSON.stringify(srv, null, 2));
    
    console.log("Resolving TXT records for cluster0.l7xeac9.mongodb.net...");
    const txt = await dns.resolveTxt('cluster0.l7xeac9.mongodb.net');
    console.log('TXT Records (options):', JSON.stringify(txt, null, 2));
  } catch (error) {
    console.error("Resolution failed:", error);
  }
}

run();
