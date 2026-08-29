export default function PageHeader({ title, children }) {
  return (
    <header>
      <h1>{title}</h1>
      {/* 右側にボタンなどを配置したい場合に対応できるように children を用意しておく */}
      {children && <div className="header-actions">{children}</div>}
    </header>
  );
}
