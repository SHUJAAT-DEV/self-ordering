import { Button, Col, Form, Input, Radio, Row, Upload } from "antd";
import { useEffect, useState } from "react";
import AddModal from "../../../UI/modal/AddModal";

import { UploadOutlined } from "@ant-design/icons";
import useMenueCategory from "../hooks/useMenueCategory";

type CreateMenueCategoryProperties = {
  isOpen: boolean;
  onClose: () => void;
  data: any;
};

function CreateMenueCategory({
  isOpen,
  onClose,
  data,
}: CreateMenueCategoryProperties) {
  console.log("modal data", data);
  const { saveMenuCategory, setIsEdit, isLoading, isSuccess, isLoadingMenue } =
    useMenueCategory({
      menuCategoryId: data.id,
    });
  type MenueImageFile = {
    file: File;
  };
  const [menueImgFile, setmenueImgFile] = useState<MenueImageFile | null>(null);
  // const { locationLists } = useLocation();
  const onFinish = (value: any) => {
    if (data.length !== 0) {
      console.log("data to send", value);
      setIsEdit(true);
      // username(data.id);
      saveMenuCategory({ menue: value, image: menueImgFile });
    } else {
      //saveMenu(value);
      saveMenuCategory({ menue: value, image: menueImgFile });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      onClose();
    }
    if (data.length !== 0) {
    }
  }, [isSuccess]);

  const formInitialValues = {
    name: data?.name,
    isAvailable: data?.isAvailable,
  };
  const [value, setValue] = useState(true);
  const onChange = (e: any) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const handleFileChange = (file: any) => {
    if (file) {
      setmenueImgFile(file);
    } else {
      console.error("No file selected.");
    }
  };
  return (
    <AddModal
      title={
        data.length !== 0 ? "Update Menue Categoroy" : "Create Menue Category"
      }
      isOpen={isOpen}
      onClose={onClose}
      footer={
        data.length !== 0 ? (
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoadingMenue}
            disabled={isLoadingMenue}
            block
            form="basic"
          >
            Update Menue Category
          </Button>
        ) : (
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoadingMenue}
            disabled={isLoadingMenue}
            block
            form="basic"
          >
            Create Menu Category
          </Button>
        )
      }
    >
      <Form
        name="basic"
        layout="vertical"
        style={{
          backgroundColor: "#ffffff",
          padding: 15,
          borderRadius: 10,
        }}
        onFinish={onFinish}
        autoComplete="off"
        initialValues={formInitialValues}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please insert menue category name!",
                },
              ]}
            >
              <Input placeholder="Please insert menue category name!" />
            </Form.Item>
          </Col>
          <Col span={12}>
            {data.length !== 0 ? (
              <Form.Item
                name="isAvailable"
                label="Is Available"
                rules={[
                  {
                    required: false,
                    message: "Please select Menu Category Availability",
                  },
                ]}
              >
                <Radio.Group
                //onChange={onChange}
                //value={value}
                //defaultValue="true"
                >
                  <Radio value={true}>
                    <b>Yes</b>
                  </Radio>
                  <Radio value={false}>
                    <b>No</b>
                  </Radio>
                </Radio.Group>
              </Form.Item>
            ) : (
              <Form.Item
                name="isAvailable"
                label="Is Available"
                initialValue={true}
                rules={[
                  {
                    required: false,
                    message: "Please select Menu Category Availability",
                  },
                ]}
              >
                <Radio.Group
                //onChange={onChange}
                //value={value}
                //defaultValue="true"
                >
                  <Radio value={true}>
                    <b>Yes</b>
                  </Radio>
                  <Radio value={false}>
                    <b>No</b>
                  </Radio>
                </Radio.Group>
              </Form.Item>
            )}
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="image"
              label="Upload Image"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload
                customRequest={handleFileChange}
                showUploadList={false}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>Click to upload</Button>
                {menueImgFile && <p>uploaded file:{menueImgFile?.file.name}</p>}
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </AddModal>
  );
}

export default CreateMenueCategory;
