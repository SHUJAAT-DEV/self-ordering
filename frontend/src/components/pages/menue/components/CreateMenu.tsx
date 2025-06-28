import { Button, Col, Form, Input, Radio, Row, Select, Upload } from "antd";
import { useEffect, useMemo, useState } from "react";
import AddModal from "../../../UI/modal/AddModal";
import useMenue from "../hooks/useMenue";
import { UploadOutlined } from "@ant-design/icons";
import useMenueCategory from "../../menue-category/hooks/useMenueCategory";
const { Option } = Select;
type CreateMenueProperties = {
  isOpen: boolean;
  onClose: () => void;
  data: any;
};

function CreateMenue({ isOpen, onClose, data }: CreateMenueProperties) {
  console.log("modal data", data);
  const { saveMenu, setIsEdit, isLoading, isSuccess, isLoadingMenue } =
    useMenue({
      menuId: data.id,
    });
  const { menueCategoryList } = useMenueCategory({});
  type MenueImageFile = {
    file: File;
  };
  const [menueImgFile, setmenueImgFile] = useState<MenueImageFile | null>(null);
  // const { locationLists } = useLocation();
  const onFinish = (value: any) => {
    console.log("data to sendaaaa", value);
    if (data.length !== 0) {
      console.log("data to send", value);
      setIsEdit(true);
      // username(data.id);
      saveMenu({ menue: value, image: menueImgFile });
    } else {
      //saveMenu(value);
      saveMenu({ menue: value, image: menueImgFile });
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
    price: data?.price,
    discount: data?.discount,
    isAvailable: data?.isAvailable,
    menueCategoryId: data?.menueCategoryId?.id,
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
  const menuCategories = useMemo(
    () =>
      menueCategoryList?.map((item: any) => ({
        value: item.id,
        label: item.name,
      })),
    [menueCategoryList]
  );
  const [filteredOptions, setFilteredOptions] = useState(menuCategories);
  const handleSearch = (value: any) => {
    console.log("hitt", value);
    const filtered = menuCategories.filter((menuCatList: any) =>
      menuCatList?.label.toLowerCase().startsWith(value.toLowerCase())
    );
    console.log("fileterd", filtered);
    setFilteredOptions(filtered);
  };
  return (
    <AddModal
      title={data.length !== 0 ? "Update Menue" : "Create Menue"}
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
            Update Menue
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
            Create Menu
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
                  message: "Please insert menue name!",
                },
              ]}
            >
              <Input placeholder="Please insert menue name!" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Price"
              name="price"
              rules={[
                {
                  required: true,
                  message: "Please price",
                },
              ]}
            >
              <Input placeholder="Please insert price" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            {data.length !== 0 ? (
              <Form.Item
                name="isAvailable"
                label="Is Available"
                rules={[
                  {
                    required: false,
                    message: "Please select Menu Availability",
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
                    message: "Please select Menu Availability",
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
          <Col span={12}>
            <Form.Item
              label="Menue Category"
              name="menueCategoryId"
              rules={[
                {
                  required: true,
                  message: "Please select Menue Category!",
                },
              ]}
            >
              <Select
                showSearch
                options={filteredOptions ?? menuCategories}
                onSearch={handleSearch}
                filterOption={false}
              >
                {filteredOptions?.map((state: any) => (
                  <Option key={state.value} value={state.value}>
                    {state.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          {/* <Col span={12}>
            <Form.Item
              label="Discount"
              name="discount"
              rules={[
                {
                  required: false,
                  message: "Please enter discount",
                },
              ]}
            >
              <Input placeholder="Please insert discount" />
            </Form.Item>
          </Col> */}
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

export default CreateMenue;
