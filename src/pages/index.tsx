import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { ChevronLeftIcon, ChevronRightIcon, PhotoIcon } from '@heroicons/react/24/solid'
import DatePicker from 'react-datepicker'
import Image from "next/image";
import { api } from "../utils/api";
import { forwardRef, useEffect, useRef, useState } from 'react'
import { format, getYear } from "date-fns";
import { v4 as uuidv4 } from "uuid";




type FileType = { file: File; };


const Home: NextPage = () => {
  const hello = api.user.hello.useQuery({ text: "from tRPC" });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const ref = useRef<HTMLInputElement>(null)


  const [previewAttachments, setPreviewAttachments] = useState<FileType[]>([])


  const newRoom = api.receptionist.createRoom.useMutation()

  const presignedUrls = api.receptionist.createPresignedUrl.useQuery(
    {
      count: previewAttachments.length,
    },
    {
      enabled: previewAttachments.length > 0,
    }

  )

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPreviewAttachments = [];
      for (const file of e.target.files) {
        // const newFile = {
        //   file: {
        //     id: uuidv4(),
        //     type: "IMAGE",
        //     url: URL.createObjectURL(file),
        //     mime: file.type,
        //     name: file.name,
        //     extension: file.name.split(".").pop() as string,
        //     size: file.size,
        //     height: null,
        //     width: null,
        //     createdAt: new Date(),
        //   }
        // }

        newPreviewAttachments.push({ file });
      }
      setPreviewAttachments([
        ...previewAttachments,
        ...newPreviewAttachments,
      ]);
    }
  }

  const createPost = async () => {
    const uploads: { key: string; ext: string }[] = [];

    if (previewAttachments.length && presignedUrls.data) {
      for (let i = 0; i < previewAttachments.length; i++) {
        const previewAttachment = previewAttachments[i];
        const data = presignedUrls.data[i];





        if (previewAttachment && data && data.key && data.url) {
          const { file } = previewAttachment;

          await fetch(data.url, {
            method: "PUT",
            body: file,

          });

          uploads.push({
            key: data.key,
            ext: file.name.split(".").pop() as string,
          });
        }

      }
    }
    newRoom.mutate({
      files: uploads,
    })
  }



  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://create.t3.gg/en/usage/first-steps"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">First Steps →</h3>
              <div className="text-lg">
                Just the basics - Everything you need to know to set up your
                database and authentication.
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://create.t3.gg/en/introduction"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Documentation →</h3>
              <div className="text-lg">
                Learn more about Create T3 App, the libraries it uses, and how
                to deploy it.
              </div>
            </Link>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p>


            <AuthShowcase />
            {/* calenderPicker  */}
            <div className="flex gap-6">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date as Date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                renderCustomHeader={({
                  date,
                  changeYear,
                  changeMonth,
                  decreaseMonth,
                  increaseMonth,
                  prevMonthButtonDisabled,
                  nextMonthButtonDisabled,
                }) => (
                  <div className="flex items-center justify-between px-2 py-2">
                    <span className="text-lg text-gray-700">
                      {format(date, 'MMMM yyyy')}
                    </span>

                    <div className="space-x-2">
                      <button
                        onClick={decreaseMonth}
                        disabled={prevMonthButtonDisabled}
                        type="button"
                        className={`
                              ${prevMonthButtonDisabled && 'cursor-not-allowed opacity-50'}
                              inline-flex p-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500
                          `}
                      >
                        <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                      </button>

                      <button
                        onClick={increaseMonth}
                        disabled={nextMonthButtonDisabled}
                        type="button"
                        className={`
                              ${nextMonthButtonDisabled && 'cursor-not-allowed opacity-50'}
                              inline-flex p-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500
                          `}
                      >
                        <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                )}
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date as Date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                renderCustomHeader={({
                  date,
                  changeYear,
                  changeMonth,
                  decreaseMonth,
                  increaseMonth,
                  prevMonthButtonDisabled,
                  nextMonthButtonDisabled,
                }) => (
                  <div className="flex items-center justify-between px-2 py-2">
                    <span className="text-lg text-gray-700">
                      {format(date, 'MMMM yyyy')}
                    </span>

                    <div className="space-x-2">
                      <button
                        onClick={decreaseMonth}
                        disabled={prevMonthButtonDisabled}
                        type="button"
                        className={`
                              ${prevMonthButtonDisabled && 'cursor-not-allowed opacity-50'}
                              inline-flex p-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500
                          `}
                      >
                        <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                      </button>

                      <button
                        onClick={increaseMonth}
                        disabled={nextMonthButtonDisabled}
                        type="button"
                        className={`
                              ${nextMonthButtonDisabled && 'cursor-not-allowed opacity-50'}
                              inline-flex p-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500
                          `}
                      >
                        <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                )}
              />
            </div>









            {/*  uplload */}
            <input
              ref={ref}
              className="hidden"
              type="file"
              onChange={onFileChange}
              multiple />
            {/*  */}
            <button
              onClick={() => ref.current?.click()}
              className="rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500"
            >
              <PhotoIcon className="w-6 h-6 text-gray-400" />
            </button>
            <button onClick={() => { void createPost() }}>
              upload
            </button>
          </div>
        </div>
      </main>

    </>
  )
}

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: adminSecretMessage } = api.admin.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user?.role === "ADMIN" }
  );



  return (

    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {sessionData && <span>you are {sessionData.user?.role}</span>}

        {adminSecretMessage && <span> - {adminSecretMessage}</span>}

      </p>

      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};


