import { Modal } from "antd";
import { ReactNode } from "react";
type ModalProperties = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children?: any;
  width?: string;
  footer?: ReactNode;
  isloading?: boolean;
};

function AddModal({
  title,
  isOpen,
  onClose,
  children,
  width,
  footer = null,
  isloading,
}: ModalProperties) {
  return (
    <Modal
      title={title}
      centered={true}
      visible={isOpen}
      okText="Close"
      onOk={onClose}
      onCancel={onClose}
      width={width}
      maskClosable={false}
      footer={footer}
    >
      {isloading ? <p>Please Wait...</p> : <>{children}</>}
    </Modal>
  );
}

export default AddModal;
