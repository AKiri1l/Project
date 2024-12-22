import socket
import logging
import psutil
import time

# Настройка логирования
logging.basicConfig(filename='network_scan_detection.log', level=logging.INFO, 
                    format='%(message)s', encoding='utf-8')

def detect_port_scanning(threshold):
    connections = psutil.net_connections(kind='inet')
    ip_counter = {}

    # Подсчет подключений по IP
    for conn in connections:
        if conn.status == 'ESTABLISHED':
            ip = conn.raddr[0]
            ip_counter[ip] = ip_counter.get(ip, 0) + 1
    
    # Проверка на сканирование
    for ip, count in ip_counter.items():
        if count > threshold:
            # Сообщение с требуемым форматом
            log_message = f'{time.strftime("%Y-%m-%d")}*{time.strftime("%H:%M:%S")},{int(time.time() * 1000) % 1000} - Попытка сканирования с IP {ip} зафиксирована. Количество подключений: {count} ;'
            logging.warning(log_message)

def main():
    logging.info('Запуск программы для выявления попыток сканирования портов')
    try:
        while True:
            detect_port_scanning(threshold=5)  # Порог для выявления сканирования
            time.sleep(10)  # Проверяем каждые 10 секунд
    except KeyboardInterrupt:
        logging.info('Остановка программы')

if __name__ == '__main__':
    main()