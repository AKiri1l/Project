from scapy.all import *

target_ip = "192.168.1.1"  # Замените на IP адрес устройства, которое хотите сканировать
ports = [22, 80, 443]  # Порты для сканирования

def random_ip():
    return f"{random.randint(1, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}"

# Количество запросов, превышающее порог
requests_count = 10  # Установите больше, чем SCAN_THRESHOLD в первой программе
raunds = 5

for port in ports:
    for i in range(raunds):
        spoofed_ip = random_ip()
        for _ in range(requests_count):
            pkt = IP(src=spoofed_ip, dst=target_ip) / TCP(dport=port, flags="S")
            send(pkt)