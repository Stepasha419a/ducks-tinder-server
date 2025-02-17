// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.36.5
// 	protoc        v5.27.0
// source: proto/file.proto

package gen

import (
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
	unsafe "unsafe"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

type UploadFileRequest struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Data          []byte                 `protobuf:"bytes,1,opt,name=data,proto3" json:"data,omitempty"`
	Type          string                 `protobuf:"bytes,2,opt,name=type,proto3" json:"type,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *UploadFileRequest) Reset() {
	*x = UploadFileRequest{}
	mi := &file_proto_file_proto_msgTypes[0]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *UploadFileRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*UploadFileRequest) ProtoMessage() {}

func (x *UploadFileRequest) ProtoReflect() protoreflect.Message {
	mi := &file_proto_file_proto_msgTypes[0]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use UploadFileRequest.ProtoReflect.Descriptor instead.
func (*UploadFileRequest) Descriptor() ([]byte, []int) {
	return file_proto_file_proto_rawDescGZIP(), []int{0}
}

func (x *UploadFileRequest) GetData() []byte {
	if x != nil {
		return x.Data
	}
	return nil
}

func (x *UploadFileRequest) GetType() string {
	if x != nil {
		return x.Type
	}
	return ""
}

type UploadFileResponse struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Filename      string                 `protobuf:"bytes,3,opt,name=filename,proto3" json:"filename,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *UploadFileResponse) Reset() {
	*x = UploadFileResponse{}
	mi := &file_proto_file_proto_msgTypes[1]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *UploadFileResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*UploadFileResponse) ProtoMessage() {}

func (x *UploadFileResponse) ProtoReflect() protoreflect.Message {
	mi := &file_proto_file_proto_msgTypes[1]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use UploadFileResponse.ProtoReflect.Descriptor instead.
func (*UploadFileResponse) Descriptor() ([]byte, []int) {
	return file_proto_file_proto_rawDescGZIP(), []int{1}
}

func (x *UploadFileResponse) GetFilename() string {
	if x != nil {
		return x.Filename
	}
	return ""
}

type DeleteFileRequest struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Filename      string                 `protobuf:"bytes,3,opt,name=filename,proto3" json:"filename,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *DeleteFileRequest) Reset() {
	*x = DeleteFileRequest{}
	mi := &file_proto_file_proto_msgTypes[2]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *DeleteFileRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*DeleteFileRequest) ProtoMessage() {}

func (x *DeleteFileRequest) ProtoReflect() protoreflect.Message {
	mi := &file_proto_file_proto_msgTypes[2]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use DeleteFileRequest.ProtoReflect.Descriptor instead.
func (*DeleteFileRequest) Descriptor() ([]byte, []int) {
	return file_proto_file_proto_rawDescGZIP(), []int{2}
}

func (x *DeleteFileRequest) GetFilename() string {
	if x != nil {
		return x.Filename
	}
	return ""
}

type DeleteFileResponse struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Filename      string                 `protobuf:"bytes,3,opt,name=filename,proto3" json:"filename,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *DeleteFileResponse) Reset() {
	*x = DeleteFileResponse{}
	mi := &file_proto_file_proto_msgTypes[3]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *DeleteFileResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*DeleteFileResponse) ProtoMessage() {}

func (x *DeleteFileResponse) ProtoReflect() protoreflect.Message {
	mi := &file_proto_file_proto_msgTypes[3]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use DeleteFileResponse.ProtoReflect.Descriptor instead.
func (*DeleteFileResponse) Descriptor() ([]byte, []int) {
	return file_proto_file_proto_rawDescGZIP(), []int{3}
}

func (x *DeleteFileResponse) GetFilename() string {
	if x != nil {
		return x.Filename
	}
	return ""
}

var File_proto_file_proto protoreflect.FileDescriptor

var file_proto_file_proto_rawDesc = string([]byte{
	0x0a, 0x10, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x2f, 0x66, 0x69, 0x6c, 0x65, 0x2e, 0x70, 0x72, 0x6f,
	0x74, 0x6f, 0x12, 0x04, 0x66, 0x69, 0x6c, 0x65, 0x22, 0x3b, 0x0a, 0x11, 0x55, 0x70, 0x6c, 0x6f,
	0x61, 0x64, 0x46, 0x69, 0x6c, 0x65, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x12, 0x12, 0x0a,
	0x04, 0x64, 0x61, 0x74, 0x61, 0x18, 0x01, 0x20, 0x01, 0x28, 0x0c, 0x52, 0x04, 0x64, 0x61, 0x74,
	0x61, 0x12, 0x12, 0x0a, 0x04, 0x74, 0x79, 0x70, 0x65, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52,
	0x04, 0x74, 0x79, 0x70, 0x65, 0x22, 0x30, 0x0a, 0x12, 0x55, 0x70, 0x6c, 0x6f, 0x61, 0x64, 0x46,
	0x69, 0x6c, 0x65, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x1a, 0x0a, 0x08, 0x66,
	0x69, 0x6c, 0x65, 0x6e, 0x61, 0x6d, 0x65, 0x18, 0x03, 0x20, 0x01, 0x28, 0x09, 0x52, 0x08, 0x66,
	0x69, 0x6c, 0x65, 0x6e, 0x61, 0x6d, 0x65, 0x22, 0x2f, 0x0a, 0x11, 0x44, 0x65, 0x6c, 0x65, 0x74,
	0x65, 0x46, 0x69, 0x6c, 0x65, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x12, 0x1a, 0x0a, 0x08,
	0x66, 0x69, 0x6c, 0x65, 0x6e, 0x61, 0x6d, 0x65, 0x18, 0x03, 0x20, 0x01, 0x28, 0x09, 0x52, 0x08,
	0x66, 0x69, 0x6c, 0x65, 0x6e, 0x61, 0x6d, 0x65, 0x22, 0x30, 0x0a, 0x12, 0x44, 0x65, 0x6c, 0x65,
	0x74, 0x65, 0x46, 0x69, 0x6c, 0x65, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x1a,
	0x0a, 0x08, 0x66, 0x69, 0x6c, 0x65, 0x6e, 0x61, 0x6d, 0x65, 0x18, 0x03, 0x20, 0x01, 0x28, 0x09,
	0x52, 0x08, 0x66, 0x69, 0x6c, 0x65, 0x6e, 0x61, 0x6d, 0x65, 0x32, 0x8f, 0x01, 0x0a, 0x0b, 0x46,
	0x69, 0x6c, 0x65, 0x53, 0x65, 0x72, 0x76, 0x69, 0x63, 0x65, 0x12, 0x3f, 0x0a, 0x0a, 0x55, 0x70,
	0x6c, 0x6f, 0x61, 0x64, 0x46, 0x69, 0x6c, 0x65, 0x12, 0x17, 0x2e, 0x66, 0x69, 0x6c, 0x65, 0x2e,
	0x55, 0x70, 0x6c, 0x6f, 0x61, 0x64, 0x46, 0x69, 0x6c, 0x65, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73,
	0x74, 0x1a, 0x18, 0x2e, 0x66, 0x69, 0x6c, 0x65, 0x2e, 0x55, 0x70, 0x6c, 0x6f, 0x61, 0x64, 0x46,
	0x69, 0x6c, 0x65, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x3f, 0x0a, 0x0a, 0x44,
	0x65, 0x6c, 0x65, 0x74, 0x65, 0x46, 0x69, 0x6c, 0x65, 0x12, 0x17, 0x2e, 0x66, 0x69, 0x6c, 0x65,
	0x2e, 0x44, 0x65, 0x6c, 0x65, 0x74, 0x65, 0x46, 0x69, 0x6c, 0x65, 0x52, 0x65, 0x71, 0x75, 0x65,
	0x73, 0x74, 0x1a, 0x18, 0x2e, 0x66, 0x69, 0x6c, 0x65, 0x2e, 0x44, 0x65, 0x6c, 0x65, 0x74, 0x65,
	0x46, 0x69, 0x6c, 0x65, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x42, 0x07, 0x5a, 0x05,
	0x2e, 0x2f, 0x67, 0x65, 0x6e, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
})

var (
	file_proto_file_proto_rawDescOnce sync.Once
	file_proto_file_proto_rawDescData []byte
)

func file_proto_file_proto_rawDescGZIP() []byte {
	file_proto_file_proto_rawDescOnce.Do(func() {
		file_proto_file_proto_rawDescData = protoimpl.X.CompressGZIP(unsafe.Slice(unsafe.StringData(file_proto_file_proto_rawDesc), len(file_proto_file_proto_rawDesc)))
	})
	return file_proto_file_proto_rawDescData
}

var file_proto_file_proto_msgTypes = make([]protoimpl.MessageInfo, 4)
var file_proto_file_proto_goTypes = []any{
	(*UploadFileRequest)(nil),  // 0: file.UploadFileRequest
	(*UploadFileResponse)(nil), // 1: file.UploadFileResponse
	(*DeleteFileRequest)(nil),  // 2: file.DeleteFileRequest
	(*DeleteFileResponse)(nil), // 3: file.DeleteFileResponse
}
var file_proto_file_proto_depIdxs = []int32{
	0, // 0: file.FileService.UploadFile:input_type -> file.UploadFileRequest
	2, // 1: file.FileService.DeleteFile:input_type -> file.DeleteFileRequest
	1, // 2: file.FileService.UploadFile:output_type -> file.UploadFileResponse
	3, // 3: file.FileService.DeleteFile:output_type -> file.DeleteFileResponse
	2, // [2:4] is the sub-list for method output_type
	0, // [0:2] is the sub-list for method input_type
	0, // [0:0] is the sub-list for extension type_name
	0, // [0:0] is the sub-list for extension extendee
	0, // [0:0] is the sub-list for field type_name
}

func init() { file_proto_file_proto_init() }
func file_proto_file_proto_init() {
	if File_proto_file_proto != nil {
		return
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: unsafe.Slice(unsafe.StringData(file_proto_file_proto_rawDesc), len(file_proto_file_proto_rawDesc)),
			NumEnums:      0,
			NumMessages:   4,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_proto_file_proto_goTypes,
		DependencyIndexes: file_proto_file_proto_depIdxs,
		MessageInfos:      file_proto_file_proto_msgTypes,
	}.Build()
	File_proto_file_proto = out.File
	file_proto_file_proto_goTypes = nil
	file_proto_file_proto_depIdxs = nil
}
