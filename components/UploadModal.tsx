"use client";

import uniqid from "uniqid";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import useUploadModal from "@/hooks/useUploadModal";
import { useUser } from "@/hooks/useUser";

import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const UploadModal = () => {
    const [isLoading, setIsLoading] = useState(false);
    const uploadModal = useUploadModal();
    const {user} = useUser();
    const supabaseClient = useSupabaseClient();
    const router = useRouter();

    const{
        register,
        handleSubmit,
        reset
    } =useForm<FieldValues>({
        defaultValues:{
            author:'',
            title:'',
            song:'null',
            image:'null',              //string degil dosya olacakları icin null koyduk.
        }
    })

    const onChange = (open: boolean) =>{
        if(!open){
            reset();
            uploadModal.onClose();
        }
    }

    const onSubmit: SubmitHandler<FieldValues> = async(values) => {
        try{
            setIsLoading(true);

            const imageFile = values.image?.[0];
            const songFile = values.song?.[0];

            if(!imageFile || !songFile || !user){
                toast.error('Eksik alan');
                return;               //return burada önemli çünkü return olmazsa try tekrar tekrar upload etmeyi dener.
            }

            const uniqueID = uniqid();

            //upload song (şarkı yükleme)
         const {
            data: songData,
            error: songError,
         } = await supabaseClient
         .storage
         .from('songs') 
         .upload(`song-${values.title}-${uniqueID}`,songFile,{
            cacheControl:'3600',
            upsert:false
         });

         if(songError){
            setIsLoading(false);
            return toast.error('Şarkı yüklenemedi');
         }

         //upload image (görsel yükleme)
         const {
            data: imageData,
            error: imageError,
         } = await supabaseClient
         .storage
         .from('images') 
         .upload(`image-${values.title}-${uniqueID}`,imageFile,{
            cacheControl:'3600',
            upsert:false
         });

         if(imageError) {
            setIsLoading(false);
            return toast.error('Görsel yüklenemedi');
         }

         const{
            error: supabaseError
         } = await supabaseClient
            .from('songs')
            .insert({
                user_id: user.id,
                title: values.title,
                author: values.author,
                image_path: imageData.path,
                song_path: songData.path
            });

            if(supabaseError){
                setIsLoading(false);
                return toast.error(supabaseError.message);
            }

            router.refresh();
            setIsLoading(false);
            toast.success('Şarkı oluşturuldu!');
            reset();
            uploadModal.onClose();
        }catch(error){
            toast.error("Bir şeyler ters gitti.");
        }finally{
            setIsLoading(false);
        }
    }

    return (
        <Modal
            title="Şarkı ekle"
            description="mp3 dosyası yükle"
            isOpen={uploadModal.isOpen}
            onChange={onChange}
            >
            <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-y-4"
            >
                <Input 
                        id="title"
                        disabled={isLoading}
                        {...register('title', {required: true})}
                        placeholder="Şarkı başlığı"
                />
                <Input 
                        id="author"
                        disabled={isLoading}
                        {...register('author', {required: true})}
                        placeholder="Sanatçı"
                />
                <div>
                    <div className="pb-1">
                        Bir şarkı dosyası seç.
                    </div>
                    <Input 
                        id="song"
                        type="file"
                        disabled={isLoading}
                        accept=".mp3"
                        {...register('song', {required: true})}                
                />
                </div>
                <div>
                    <div className="pb-1">
                        Bir görsel seç.
                    </div>
                    <Input 
                        id="image"
                        type="file"
                        disabled={isLoading}
                        accept="image/*"
                        {...register('image', {required: true})}
                        
                />
                <Button disabled={isLoading} type="submit">
                    Oluştur
                </Button>
                </div>
            </form>
        </Modal>
    );
}

export default UploadModal;