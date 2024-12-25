from scapy.all import *
import logging
from collections import defaultdict
import time

# Настройка логирования
logging.basicConfig(filename='port_scan_logs.txt', level=logging.INFO, format='%(asctime)s - %(message)s')

# Порог для количества попыток сканирования
SCAN_THRESHOLD = 10
TIME_THRESHOLD = 5  # Порог времени в секундах
scan_attempts = defaultdict(int)
last_packet_time = defaultdict(float)

# Файл для записи IP-адресов, достигших порога
threshold_ip_file = 'threshold_ips.txt'


def is_ip_in_file(ip):
    """Проверяет, есть ли IP-адрес в файле."""
    try:
        with open(threshold_ip_file, 'r') as f:
            return ip in f.read().splitlines()
    except FileNotFoundError:
        return False  # Если файл не найден, значит, IP-адреса нет


def packet_callback(packet):
    if packet.haslayer(TCP) and (packet[TCP].flags == 0x02 or packet[TCP].flags == 0x12):
        src_ip = packet[IP].src
        dst_port = packet[TCP].dport
        current_time = time.time()

        # Проверка времени последнего пакета
        if current_time - last_packet_time[src_ip] > TIME_THRESHOLD:
            scan_attempts[src_ip] = 1  # Сброс счетчика
        else:
            scan_attempts[src_ip] += 1  # Увеличение счетчика

        last_packet_time[src_ip] = current_time  # Обновление времени последнего пакета

        # Проверка на превышение порога
        if scan_attempts[src_ip] >= SCAN_THRESHOLD:
            logging.info(f"Обнаружено сканирование с IP: {src_ip}, Порт: {dst_port} (порог достигнут)")
            # Проверка на наличие IP в файле перед записью
            if not is_ip_in_file(src_ip):
                with open(threshold_ip_file, 'a') as f:
                    f.write(f"{src_ip}\n")
        else:
            logging.info(f"Обнаружено сканирование с IP: {src_ip}, Порт: {dst_port}")


# Запуск сниффера
sniff(filter="tcp", prn=packet_callback, store=0)