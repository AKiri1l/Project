import psutil
import win32evtlog
import win32evtlogutil
import win32security
import time


def get_open_ports():
    """Получить список открытых портов на устройстве."""
    open_ports = []
    for conn in psutil.net_connections(kind='inet'):
        open_ports.append((conn.laddr.ip, conn.laddr.port))
    return open_ports


def read_event_logs():
    """Читать события из журнала Windows, связанные с сетевыми подключениями и безопасностью."""
    server = 'localhost'
    log_type = 'Security'

    try:
        hand = win32evtlog.OpenEventLog(server, log_type)
    except Exception as e:
        print(f"Ошибка при открытии журнала событий: {e}")
        return []

    total_events = win32evtlog.GetNumberOfEventLogRecords(hand)
    events = []

    for i in range(total_events):
        try:
            event = win32evtlog.ReadEventLog(hand,
                                             win32evtlog.EVENTLOG_FORWARDS_READ | win32evtlog.EVENTLOG_SEQUENTIAL_READ,
                                             0)
            for e in event:
                if e.EventID in (5156, 5158):  # События, связанные с сетевыми подключениями
                    events.append({
                       'EventID': e.EventID,
                       'Time': f"{e.TimeGenerated.Format().split()[3]} {e.TimeGenerated.Format().split()[2]} {e.TimeGenerated.Format().split()[1]} {e.TimeGenerated.Format().split()[4]}",
                       'Info': e.StringInserts
                    })
        except Exception as e:
            print(f"Ошибка при чтении событий: {e}")
            break

    win32evtlog.CloseEventLog(hand)
    return events


def main():
    print("Запуск прослушивания открытых портов и журналов событий...")
    open_ports = get_open_ports()
    print(f"Открытые порты: {[port for ip, port in open_ports]}")

    while True:
        events = read_event_logs()
        for event in events:
            print(event)

        time.sleep(10)  # Пауза между проверками


if __name__ == "__main__":
    main()
