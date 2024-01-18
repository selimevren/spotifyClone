import getSongs from "@/actions/getSongs";
import Header from "@/components/Header";
import ListItem from "@/components/ListItem";

import PageContent from "./components/PageContent";

export const revalidate = 0;  //veriyi her zaman taze tutabilmek adına revalidate degerini 0 verdik böylece veriyi sürekli yeniliyor.

export default async function Home() {
    const songs = await getSongs();
  return (
    <div className="
              bg-neutral-900
              rounded-lg
              h-full
              w-full
              overflow-hidden
              overflow-y-auto
              ">
      <Header>
          <div className="mb-2">
            <h1
            className="
              text-white
              text-3xl
              font-semibold
            "
            >
              Tekrar Hoşgeldin
            </h1>
            <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              xl:grid-cols-3
              2xl:grid-cols-4
              gap-3
              mt-4
            "
            >
              <ListItem 
              image="/images/liked.png"
              name="Beğenilen Şarkılar"
              href="liked"
              />
            </div>
          </div>
      </Header>
      <div className="mt-2 mb-7 px-6">
          <div className="felx justify-between items-center">
            <h1 className="text-white text-2xl font-semibold">
              En Yeni Şarkılar
            </h1>
          </div>
          <div>
            <PageContent songs ={songs}/>
          </div>
      </div>
    </div>
  )
}
