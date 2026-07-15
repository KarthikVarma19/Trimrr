import React, { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "./ui/input.jsx";
import { Button } from "./ui/button.jsx";
import { BeatLoader } from "react-spinners";
import Error from "./Error.jsx";

import * as Yup from "yup";
import useFetch from "@/hooks/useFetch.js";
import { signup } from "@/db/apiAuth.js";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UrlState } from "@/Context/context.jsx";

const Signup = () => {
  const [errors, setErrors] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: null,
  });

  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };

  const { data, error, loading, fn: fnSignup } = useFetch(signup, formData);
  const { fetchUser } = UrlState();

  useEffect(() => {
    if (error === null && data) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
    fetchUser();
  }, [error, loading]);

  const handleSignup = async () => {
    setErrors([]);
    try {
      // Validating the Form Data Using Yup Package Which Makes Validation Simple and Easy
      const schema = Yup.object().shape({
        name: Yup.string().required("Name is Required"),
        email: Yup.string()
          .email("Invalid Email")
          .required("Email is Required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is password"),
        profile_pic: Yup.mixed().required("Profile picture is required"),
      });
      await schema.validate(formData, { abortEarly: false });
      // api call
      await fnSignup();
    } catch (e) {
      const newErrors = {};

      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  };

  return (
    <Card className="border border-white">
      <CardHeader>
        <CardTitle>Signup</CardTitle>
        <CardDescription>
          create a new account if you haven&rsquo;t already
        </CardDescription>
        {error && <Error message={error.message} />}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Input
            name="name"
            type="text"
            placeholder="Enter Name"
            onChange={handleInputChange}
          />
          {errors.name && <Error message={errors.name} />}
        </div>
        <div className="space-y-1">
          <Input
            name="email"
            type="email"
            placeholder="Enter Email"
            onChange={handleInputChange}
          />
          {errors.email && <Error message={errors.email} />}
        </div>
        <div className="space-y-1">
          <Input
            name="password"
            type="password"
            placeholder="Enter Password"
            onChange={handleInputChange}
          />
          {errors.password && <Error message={errors.password} />}
        </div>
        <div className="space-y-1">
          <Input
            name="profile_pic"
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="cursor-pointer"
          />
          {errors.profile_pic && <Error message={errors.profile_pic} />}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSignup} className="cursor-pointer">
          {loading ? (
            <BeatLoader size={10} color="#36d7b7" />
          ) : (
            "Create Account"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Signup;
