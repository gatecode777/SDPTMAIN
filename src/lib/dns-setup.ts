import dns from "dns";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
  console.log("DNS servers successfully set to Google/Cloudflare DNS");
} catch (e) {
  console.warn("Failed to set DNS servers in dns-setup.ts:", e);
}
