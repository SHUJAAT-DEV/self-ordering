import {
    Button,
    Col,
    Form,
    Input,
    List,
    Row,
    Select,
    Upload,
    Image,
  } from "antd";
  import { useEffect, useMemo, useState } from "react";
  import AddModal from "../../../UI/modal/AddModal";
import useMenueCategory from "../hooks/useMenueCategory";
  
  
  type DeleteMenuCategoryProperties = {
    isOpen: boolean;
    onClose: () => void;
    data: any;
  };
  
  function DeleteMenuCategory({ isOpen, onClose, data }: DeleteMenuCategoryProperties) {
    
    const {
        deleteMenueCategory,
        deleteMenueCategoryError,
        isLoadingdeleteMenueCategory,
        deleteMenueCategorySuccess,
    } = useMenueCategory({
      menuCategoryId: data.id,
    });
  
    useEffect(() => {
      if (deleteMenueCategorySuccess) {
        onClose();
      }
    }, [deleteMenueCategorySuccess]);
  
    
  
    const onFinish = () => {
        deleteMenueCategory();
    };
  
    return (
      <AddModal
        title={"Delete Menue Category"}
        isOpen={isOpen}
        onClose={onClose}
        footer={
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoadingdeleteMenueCategory}
            disabled={isLoadingdeleteMenueCategory}
            block
            form="basic"
          >
            Delete
          </Button>
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
          
        >
          <Row gutter={24}>
            <Col span={24}>
              <p>Are you sure you want to delete this menue category?</p>
            </Col>
          </Row>
        </Form>
      </AddModal>
    );
  }
  
  export default DeleteMenuCategory;