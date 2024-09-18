module.exports = {
    apps: [
      {
        name: "chat_app_server",
        script: "./dist/index.js",
        max_memory_restart: "300M",
  
        // Logging
        out_file: "./out.log",
        error_file: "./error.log",
        merge_logs: true,
        log_date_format: "DD-MM HH:mm:ss Z",
        log_type: "json",
  
  }
  
    ]
  
  
  
  }