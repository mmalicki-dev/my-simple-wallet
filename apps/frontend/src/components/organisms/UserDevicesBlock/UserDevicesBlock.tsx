import UserBlockWrapper from "@/components/molecules/UserBlockWrapper/UserBlockWrapper";
import Button from "@/components/atoms/Button/Button";
import { useGetSessionsQuery, useDeleteSessionMutation } from "@/services/authApi";
import type { Session } from "@/types";
import styles from "./UserDevicesBlock.module.css";

function parseUserAgent(ua: string): string {
  if (!ua || ua === "unknown") return "Unknown device";

  let browser = "Unknown browser";
  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/OPR\//.test(ua)) browser = "Opera";
  else if (/Chrome\//.test(ua)) browser = "Chrome";
  else if (/Firefox\//.test(ua)) browser = "Firefox";
  else if (/Safari\//.test(ua)) browser = "Safari";

  let os = "Unknown OS";
  if (/Windows NT/.test(ua)) os = "Windows";
  else if (/Mac OS X/.test(ua)) os = "macOS";
  else if (/Android/.test(ua)) os = "Android";
  else if (/iPhone|iPad/.test(ua)) os = "iOS";
  else if (/Linux/.test(ua)) os = "Linux";

  return `${browser} on ${os}`;
}

function formatExpiry(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const DeviceRow = ({ session }: { session: Session }) => {
  const [deleteSession, { isLoading }] = useDeleteSessionMutation();

  return (
    <div className={styles.row}>
      <div className={styles.info}>
        <span className={styles.name}>{parseUserAgent(session.userAgent)}</span>
        <span className={styles.expiry}>Expires {formatExpiry(session.expiresAt)}</span>
      </div>
      <Button
        variant="danger"
        disabled={isLoading}
        onClick={() => deleteSession(session.id)}
      >
        Revoke
      </Button>
    </div>
  );
};

const UserDevicesBlock = () => {
  const { data: sessions, isLoading } = useGetSessionsQuery();

  return (
    <UserBlockWrapper title="Remembered Devices">
      {isLoading && <p className={styles.empty}>Loading…</p>}
      {!isLoading && (!sessions || sessions.length === 0) && (
        <p className={styles.empty}>No remembered devices.</p>
      )}
      {sessions && sessions.length > 0 && (
        <div className={styles.list}>
          {sessions.map((session) => (
            <DeviceRow key={session.id} session={session} />
          ))}
        </div>
      )}
    </UserBlockWrapper>
  );
};

export default UserDevicesBlock;
