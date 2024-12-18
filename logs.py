import socket
import logging
import psutil
import time

# Настройка логирования
logging.basicConfig(filename='network_scan_detection.log', level=logging.INFO,
                    format='%(asctime)s - %(message)s')


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
            logging.warning(f'Попытка сканирования с IP {ip} зафиксирована. Количество подключений: {count}')


def main():
    logging.info('Запуск программы для выявления попыток сканирования портов')
    try:
        while True:
            detect_port_scanning(threshold=5)  # Порог для выявления сканирования
            time.sleep(60)  # Проверяем каждую минуту
    except KeyboardInterrupt:
        logging.info('Остановка программы')


if __name__ == '__main__':
    main()
