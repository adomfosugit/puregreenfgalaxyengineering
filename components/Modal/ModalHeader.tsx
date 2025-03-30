'use client';

interface IModalHeaderProps {
  title: string;
  subtitle?: string;
  center?: boolean;
}
const ModalHeader = ({ title, subtitle, center }: IModalHeaderProps) => {
  return (
    <div className={center ? 'text-center' : 'text-start'}>
      <div className="text-2xl font-bold">{title}</div>
      <div className="font-light text-neutral-500 mt-2">{subtitle}</div>
    </div>
  );
};

export default ModalHeader;