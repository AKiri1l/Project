import psutil

def get_connected_devices():
    devices = psutil.disk_partitions(all=False)
    for device in devices:
        print(f"Устройство: {device.device}, Тип: {device.fstype}, Точка монтирования: {device.mountpoint}")

if __name__ == "__main__":
    get_connected_devices()