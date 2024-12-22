import psutil
import socket

def get_connected_devices():
    # Получаем информацию о сетевых интерфейсах
    interfaces = psutil.net_if_addrs()
    connected_devices = []

    for interface, addresses in interfaces.items():
        for address in addresses:
            if address.family == socket.AF_INET:  # IPv4 адрес
                connected_devices.append((interface, address.address))

    return connected_devices

if __name__ == "__main__":
    devices = get_connected_devices()
    with open("connected_devices.txt", "w") as file:
        file.write("Подключенные устройства:\n")
        for device in devices:
            file.write(f"Интерфейс: {device[0]}, IP адрес: {device[1]}\n")
